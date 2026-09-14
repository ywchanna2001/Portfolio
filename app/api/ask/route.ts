/* ============================================================================
   /api/ask — the "Ask me anything" endpoint.

   Flow:
     1. Retrieve the most relevant passages from your own content files.
     2. If GEMINI_API_KEY is set, ask Gemini to answer using only those
        passages, in your voice, and return the answer plus its sources.
     3. If no key is set, return the retrieved passages directly. The widget
        still works and still tells the truth — it just quotes instead of
        paraphrasing.

   To turn on the LLM answers:
     - get a free key at https://aistudio.google.com/apikey
     - create a file called  .env.local  in the project root
     - put this line in it:  GEMINI_API_KEY=AIza...
     - on Vercel, add the same variable under Project Settings → Environment
       Variables (never commit the key to git)
   ========================================================================== */

import { NextResponse } from "next/server";
import { retrieve } from "@/lib/knowledge";
import { site } from "@/content/site";

/** Answers are generated per request, so never cache this route. */
export const dynamic = "force-dynamic";

/**
 * Model name. Override with a GEMINI_MODEL environment variable if you want a
 * different one without editing code — the flash models are the cheap, fast
 * tier and are plenty for answering from a handful of retrieved passages.
 */
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const MAX_QUESTION_LENGTH = 500;

/** A crude in-memory rate limit, enough to stop casual abuse of your API key. */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many questions in a short time. Give it a minute." },
      { status: 429 },
    );
  }

  let question = "";
  try {
    const body = await request.json();
    question = String(body?.question ?? "").slice(0, MAX_QUESTION_LENGTH).trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  // 1. Retrieval — always happens, with or without an API key.
  const passages = retrieve(question, 4);
  const sources = passages.map((p) => p.source);

  if (passages.length === 0) {
    return NextResponse.json({
      answer: `I don't have anything on that in my notes. You can reach ${site.name.split(" ")[0]} directly at ${site.email}.`,
      sources: [],
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  /** Used when there is no key, or the API call fails for any reason. */
  const retrievalOnly = NextResponse.json({
    answer: passages.map((p) => p.text).join("\n\n"),
    sources,
    mode: "retrieval-only",
  });

  // 2. No key: return the retrieved material as-is.
  if (!apiKey) return retrievalOnly;

  // 3. With a key: let Gemini answer from the retrieved context only.
  const context = passages
    .map((p, i) => `[${i + 1}] (${p.source})\n${p.text}`)
    .join("\n\n");

  const systemPrompt = `You answer questions about ${site.name}, an AI/ML engineer, on his portfolio website.

Rules:
- Answer ONLY from the context below. If the context does not cover it, say so plainly and suggest emailing ${site.email}.
- Never invent projects, employers, dates, metrics or technologies.
- Write in third person about ${site.name.split(" ")[0]}, in a direct, concrete, unhyped voice. No marketing language.
- Two to four sentences. Lead with the specific fact the person asked for.
- Text only: no markdown, no bullet points, no headings.

Context:
${context}`;

  try {
    // The key goes in the query string, which is the form Google documents.
    // (An `x-goog-api-key` header works too if you prefer keeping it out of
    // the URL.)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      // Logged so the reason is visible in your Vercel function logs rather
      // than disappearing silently behind the fallback.
      console.error("Gemini API error", response.status, await response.text());
      return retrievalOnly;
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // No candidate comes back if the response was blocked by a safety filter
    // or the model returned nothing usable.
    if (!answer) {
      console.error("Gemini returned no usable text", JSON.stringify(data));
      return retrievalOnly;
    }

    return NextResponse.json({ answer, sources });
  } catch (err) {
    console.error("Gemini request failed", err);
    return retrievalOnly;
  }
}