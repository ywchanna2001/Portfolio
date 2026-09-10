/* ============================================================================
   /api/ask — the "Ask me anything" endpoint.

   Flow:
     1. Retrieve the most relevant passages from your own content files.
     2. If ANTHROPIC_API_KEY is set, ask Claude to answer using only those
        passages, in your voice, and return the answer plus its sources.
     3. If no key is set, return the retrieved passages directly. The widget
        still works and still tells the truth — it just quotes instead of
        paraphrasing. This means the site never breaks because of a missing
        key, which matters when a recruiter opens it on a preview deploy.

   To turn on the LLM answers:
     - create a file called  .env.local  in the project root
     - put this line in it:  ANTHROPIC_API_KEY=sk-ant-...
     - on Vercel, add the same variable under Project Settings → Environment
       Variables (never commit the key to git)
   ========================================================================== */

import { NextResponse } from "next/server";
import { retrieve } from "@/lib/knowledge";
import { site } from "@/content/site";

/** Answers are generated per request, so never cache this route. */
export const dynamic = "force-dynamic";

const MODEL = "claude-sonnet-4-5";
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

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // 2. No key: return the retrieved material as-is.
  if (!apiKey) {
    return NextResponse.json({
      answer: passages.map((p) => p.text).join("\n\n"),
      sources,
      mode: "retrieval-only",
    });
  }

  // 3. With a key: let Claude answer from the retrieved context only.
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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API returned ${response.status}`);

    const data = await response.json();
    const answer = data?.content?.[0]?.text?.trim();
    if (!answer) throw new Error("Empty response");

    return NextResponse.json({ answer, sources });
  } catch {
    // Fall back to the retrieved passages rather than showing an error.
    return NextResponse.json({
      answer: passages.map((p) => p.text).join("\n\n"),
      sources,
      mode: "retrieval-only",
    });
  }
}
