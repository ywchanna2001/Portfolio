import { publications } from "@/content/site";
import Reveal from "./Reveal";

/** The publications section. */
export default function Research() {
  return (
    <section id="research" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-24 md:px-12 lg:px-24 lg:pt-28">
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <Reveal>
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow uppercase">05 — Research</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.05] text-bright">
              Reading the papers, then rewriting them in code.
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {publications.map((pub, i) => (
            <Reveal key={pub.title} delay={i * 80}>
              <article className="flex flex-col gap-4 rounded-2xl border border-line bg-panel/60 p-8 lg:p-9">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="uppercase tracking-wide text-dim">{pub.kind}</span>
                  <a href={pub.href} className="text-accent transition-colors hover:text-accent-soft">
                    Read the paper ↗
                  </a>
                </div>

                <h3 className="font-display text-[clamp(1.5rem,2.4vw,1.875rem)] font-normal text-bright">
                  {pub.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-muted">{pub.summary}</p>

                {/* The citation block. Nice touch: it signals you expect to be
                    cited, which reads as research-serious. */}
                <pre className="overflow-x-auto rounded-lg border border-line bg-black/35 p-4 font-mono text-xs leading-relaxed text-dim">
                  {pub.citation}
                </pre>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
