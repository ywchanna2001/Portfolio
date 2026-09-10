"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/* ============================================================================
   ASK WIDGET — a chat panel that answers questions about you.

   It is opened either by its own floating button, or by any element on the
   page carrying  data-ask-trigger  (the "Ask me anything" button in the hero
   uses that, which is why the hero can stay a server component).

   The answers come from /api/ask, which retrieves passages from your content
   files and — if an API key is configured — has Claude answer from them.
   ========================================================================== */

type Message = {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
};

const SUGGESTIONS = [
  "What did you build at Orysys?",
  "Explain the AlphaFold project simply.",
  "What's your experience with RAG?",
];

export default function AskWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Let any [data-ask-trigger] element on the page open this panel.
  useEffect(() => {
    const openPanel = () => setOpen(true);
    const triggers = document.querySelectorAll("[data-ask-trigger]");
    triggers.forEach((t) => t.addEventListener("click", openPanel));
    return () => triggers.forEach((t) => t.removeEventListener("click", openPanel));
  }, []);

  // Escape closes the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            data.answer ??
            data.error ??
            `Something went wrong. You can email ${site.email} instead.`,
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `I couldn't reach the server. You can email ${site.email} instead.`,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Ask me anything"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink shadow-[0_12px_30px_rgba(79,227,193,0.35)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Ask me anything"
          className="fixed bottom-24 right-4 z-50 flex max-h-[min(560px,calc(100vh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-accent/30 bg-[#090d18]/98 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-md sm:right-6 sm:w-[380px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono text-xs text-body">
                ask-{site.name.split(" ")[0].toLowerCase()} · RAG over my CV &amp; projects
              </span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-dim hover:text-body">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed text-muted">
                  Ask about a project, a skill, or the research. Answers come from{" "}
                  {site.name.split(" ")[0]}&rsquo;s own CV and case-study notes.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-lg border border-line px-3 py-2.5 text-left text-[13px] text-[#B8C0D0] transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[85%] self-end rounded-xl rounded-br-sm bg-accent/15 px-3.5 py-2.5 text-sm leading-relaxed text-body"
                          : "max-w-[92%] self-start whitespace-pre-wrap rounded-xl rounded-bl-sm bg-white/5 px-3.5 py-2.5 text-sm leading-relaxed text-[#D5DBE6]"
                      }
                    >
                      {m.text}
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-dim"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {pending && (
                  <div className="max-w-[92%] self-start rounded-xl rounded-bl-sm bg-white/5 px-3.5 py-2.5">
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-dim"
                          style={{ animationDelay: `${d * 140}ms` }}
                        />
                      ))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="m-4 mt-0 flex items-center gap-2 rounded-xl border border-white/12 px-3.5 py-2.5 focus-within:border-accent/50"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a project, skill or paper…"
              maxLength={500}
              className="min-w-0 flex-1 bg-transparent text-sm text-body outline-none placeholder:text-faint"
            />
            <button
              type="submit"
              disabled={!input.trim() || pending}
              aria-label="Send"
              className="text-accent transition-opacity disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
