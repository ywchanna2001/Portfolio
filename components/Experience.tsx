import { experience } from "@/content/experience";
import Reveal from "./Reveal";

/** The experience and education timeline. */
export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-24 md:px-12 lg:px-24 lg:pt-28">
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <Reveal>
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow uppercase">06 — Experience</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.05] text-bright">
              Where I&rsquo;ve shipped.
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col lg:col-span-2">
          {experience.map((role, i) => (
            <Reveal key={role.title + role.org} delay={i * 70}>
              <div
                className={`grid gap-3 border-t border-line py-7 md:grid-cols-[200px_1fr] md:gap-8 ${
                  i === experience.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono text-[13px] text-dim">{role.period}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-bright">
                    {role.title} <span className="text-muted">· {role.org}</span>
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted">{role.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
