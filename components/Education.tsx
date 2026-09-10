import { education } from "@/content/education";
import Reveal from "./Reveal";

/** The Education section — degree, dates and the coursework behind it. */
export default function Education() {
  return (
    <section
      id="education"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-24 md:px-12 lg:px-24 lg:pt-28"
    >
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <Reveal>
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow uppercase">02 — Education</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.05] text-bright">
              Where the foundations came from.
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {education.map((degree, i) => (
            <Reveal key={degree.qualification} delay={i * 80}>
              <article className="flex flex-col gap-5 rounded-2xl border border-line bg-panel/60 p-8 lg:p-9">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-tight text-bright">
                      {degree.qualification}
                    </h3>
                    <span className="text-[15px] text-muted">
                      {degree.institution} · {degree.location}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full border border-accent/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                    {degree.period}
                  </span>
                </div>

                {degree.note && (
                  <p className="text-[15px] leading-relaxed text-muted">{degree.note}</p>
                )}

                {degree.coursework.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-line pt-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-dim">
                      Relevant coursework
                    </span>
                    <ul className="flex flex-wrap gap-2">
                      {degree.coursework.map((module) => (
                        <li key={module} className="chip">
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}