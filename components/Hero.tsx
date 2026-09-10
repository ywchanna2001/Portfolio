import { site } from "@/content/site";
import ProteinViewer from "./ProteinViewer";

/** The top of the home page: status line, headline, intro, buttons, 3D viewer. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Atmosphere: a teal glow top-right and a faint grid, both decorative. */}
      <div
        aria-hidden
        className="bg-glow pointer-events-none absolute -right-24 -top-48 h-[900px] w-[900px] rounded-full"
      />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 pb-16 pt-16 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-24 lg:pb-24 lg:pt-24">
        {/* Left: the words */}
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-3 font-mono text-[13px]">
            <span className="h-2 w-2 shrink-0 animate-[pulse-dot_4s_ease-in-out_infinite] rounded-full bg-accent shadow-[0_0_12px_#4FE3C1]" />
            <span className="uppercase tracking-[0.04em] text-dim">{site.availability}</span>
          </div>

          <h1 className="text-[clamp(2.375rem,5.2vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-bright">
            {site.headline.lead}{" "}
            <span className="font-display italic font-normal text-accent">
              {site.headline.emphasis}
            </span>
          </h1>

          <p className="max-w-[560px] text-base leading-relaxed text-muted md:text-lg">
            <span className="text-bright">{site.name}.</span> {site.intro}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#work"
              className="rounded-lg bg-accent px-6 py-3.5 text-center font-semibold text-ink transition-opacity hover:opacity-90"
            >
              See selected work
            </a>
            {/* This button is wired up by the chat widget — see AskWidget.tsx */}
            <button
              data-ask-trigger
              className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-6 py-3.5 font-medium text-body transition-colors hover:border-accent/50 hover:text-accent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
              </svg>
              Ask me anything
            </button>
          </div>
        </div>

        {/* Right: the 3D protein */}
        <div className="lg:pl-4">
          <ProteinViewer />
        </div>
      </div>
      {/* A hairline to close the hero off from the section below it. */}
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
        <div className="border-t border-line" />
      </div>
    </section>
  );
}
