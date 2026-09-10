import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { ProjectDiagram } from "./Diagrams";
import Reveal from "./Reveal";
import Section from "./Section";

/** The "Selected work" grid. The featured project gets the wide top card. */
export default function Work() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section
      id="work"
      eyebrow="04 — Projects"
      heading="Case studies of the selected projects."
      aside="Each one represents a complete problem-solving process: problem → approach → architecture → results → what I'd change."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80} className="lg:col-span-2">
            <FeaturedCard project={p} />
          </Reveal>
        ))}
        {rest.map((p, i) => {
          // If there is an odd number of standard cards, the last one stretches
          // across both columns so the grid never ends with an empty gap.
          const wide = rest.length % 2 === 1 && i === rest.length - 1;
          return (
            <Reveal
              key={p.slug}
              delay={(i + 1) * 80}
              className={wide ? "lg:col-span-2" : ""}
            >
              <StandardCard project={p} wide={wide} />
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function Tag({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${
        accent ? "border-accent/40 text-accent" : "border-white/12 text-dim"
      }`}
    >
      {children}
    </span>
  );
}

function ReadLink() {
  return (
    <span className="mt-auto inline-flex items-center gap-1.5 font-semibold text-accent transition-transform group-hover:translate-x-0.5">
      Read the case study
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

function FeaturedCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="group grid gap-10 rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/8 to-panel/60 p-8 transition-colors hover:border-accent/50 lg:grid-cols-2 lg:items-center lg:p-10"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Tag accent>{p.category}</Tag>
          {p.status && <Tag>{p.status}</Tag>}
        </div>
        <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.01em] text-bright">
          {p.title}
        </h3>
        <p className="leading-relaxed text-muted">{p.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <ReadLink />
      </div>
      <div className="rounded-xl border border-line bg-ink/40 p-5">
        <ProjectDiagram kind={p.diagram} />
      </div>
    </Link>
  );
}

function StandardCard({ project: p, wide = false }: { project: Project; wide?: boolean }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className={`group h-full rounded-2xl border border-line bg-panel/60 p-8 transition-colors hover:border-accent/40 ${
        wide ? "grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-10 lg:p-10" : "flex flex-col gap-4"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Tag accent>{p.category}</Tag>
          {p.status && <Tag>{p.status}</Tag>}
        </div>
        <h3 className="text-2xl font-semibold leading-tight text-bright">{p.title}</h3>
        <p className="text-[15px] leading-relaxed text-muted">{p.tagline}</p>
        {!wide && (
          <>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <ReadLink />
          </>
        )}
      </div>

      {wide && (
        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {p.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <ReadLink />
        </div>
      )}
    </Link>
  );
}
