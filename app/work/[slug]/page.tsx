import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AskWidget from "@/components/AskWidget";
import Contact from "@/components/Contact";
import { ProjectDiagram } from "@/components/Diagrams";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ResultsChart from "@/components/ResultsChart";
import SectionNav from "@/components/SectionNav";
import { getProject, getProjectNeighbours, projects } from "@/content/projects";

/* ============================================================================
   CASE STUDY PAGE — /work/<slug>

   This one file renders every project. Add a project to content/projects.ts
   and its page exists; you never touch this file.
   ========================================================================== */

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — Channa Dissanayaka`,
    description: project.standfirst,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getProjectNeighbours(slug);

  return (
    <>
      <Nav />

      <main id="main" className="relative overflow-hidden">
        <div
          aria-hidden
          className="bg-glow-blue pointer-events-none absolute -left-48 -top-72 h-[900px] w-[900px] rounded-full"
        />

        {/* Breadcrumb */}
        <div className="relative mx-auto max-w-[1440px] px-6 pt-6 md:px-12 lg:px-24">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-[13px] text-dim transition-colors hover:text-accent"
          >
            ← back to work
          </Link>
        </div>

        {/* Header */}
        <header className="relative mx-auto grid max-w-[1440px] gap-10 px-6 pb-12 pt-12 md:px-12 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-16 lg:px-24 lg:pb-14 lg:pt-16">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-accent/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-accent">
                {project.category}
              </span>
              {project.status && (
                <span className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-dim">
                  {project.status}
                </span>
              )}
            </div>

            <h1 className="text-[clamp(2.125rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-bright">
              {project.heading.lead}{" "}
              <span className="font-display italic font-normal text-accent">
                {project.heading.emphasis}
              </span>
            </h1>

            <p className="max-w-[760px] text-base leading-relaxed text-muted md:text-lg">
              {project.standfirst}
            </p>
          </div>

          {/* Fact panel */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-line pt-2 lg:border-l lg:pl-8 lg:pt-0">
            {project.meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <dt className="font-mono text-[11px] uppercase tracking-wide text-dim">
                  {m.label}
                </dt>
                <dd className="text-[15px] text-body">{m.value}</dd>
              </div>
            ))}
            <div className="col-span-2 flex flex-col gap-1">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-dim">Links</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1 text-[15px]">
                {project.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-soft"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        {/* Results figure — only for projects that have stats. */}
        {project.stats && (
          <Reveal>
            <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
              <div className="grid items-center gap-10 rounded-2xl border border-line bg-panel/60 p-6 md:p-10 lg:grid-cols-2">
                <div className="flex flex-col gap-3.5">
                  <span className="font-mono text-xs uppercase tracking-wide text-dim">
                    Fig. 1 — success rate vs. models generated per target
                  </span>
                  <ResultsChart />
                  <span className="text-[13px] leading-relaxed text-dim">
                    Baseline bars are placeholders — fill them in from the thesis
                    results table.
                  </span>
                </div>
                <dl className="flex flex-col gap-6">
                  {project.stats.map((s, i) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <dd
                        className={`font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none ${
                          i === 1 ? "text-accent" : "text-bright"
                        }`}
                      >
                        {s.value}
                      </dd>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-dim">
                        {s.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        )}

        {/* Body: sticky section nav + the five sections */}
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-6 pt-20 md:px-12 lg:grid-cols-[220px_1fr] lg:gap-20 lg:px-24 lg:pt-24">
          <SectionNav
            sections={project.sections.map((s) => ({ id: s.id, label: s.eyebrow }))}
          />

          <div className="flex max-w-[820px] flex-col gap-16 lg:gap-18">
            {project.sections.map((section) => (
              <Reveal key={section.id}>
                <section id={section.id} className="flex scroll-mt-28 flex-col gap-4">
                  <span className="eyebrow uppercase">{section.eyebrow}</span>
                  <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.375rem)] font-normal text-bright">
                    {section.heading}
                  </h2>

                  {section.body.map((para, i) => (
                    <p key={i} className="text-[17px] leading-[1.7] text-[#B8C0D0]">
                      {para}
                    </p>
                  ))}

                  {/* The architecture section renders its diagram. */}
                  {section.id === "architecture" && project.diagram && (
                    <div className="mt-2 rounded-2xl border border-line bg-panel/60 p-6 md:p-8">
                      <ProjectDiagram kind={project.diagram} />
                    </div>
                  )}

                  {section.cards && (
                    <div className="mt-2 grid gap-4 sm:grid-cols-3">
                      {section.cards.map((card) => (
                        <div
                          key={card.title}
                          className="flex flex-col gap-2 rounded-xl border border-line bg-panel/50 p-5"
                        >
                          <span className="font-mono text-[11px] uppercase tracking-wide text-accent">
                            {card.kicker}
                          </span>
                          <span className="font-semibold text-body">{card.title}</span>
                          <span className="text-[13px] leading-relaxed text-dim">
                            {card.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </Reveal>
            ))}

            {/* Prev / next */}
            <nav className="flex flex-col gap-4 border-t border-line pt-8 font-mono text-[13px] sm:flex-row sm:justify-between">
              {prev && (
                <Link href={`/work/${prev.slug}`} className="text-dim hover:text-accent">
                  ← {prev.title}
                </Link>
              )}
              {next && (
                <Link href={`/work/${next.slug}`} className="text-accent hover:text-accent-soft sm:text-right">
                  {next.title} →
                </Link>
              )}
            </nav>
          </div>
        </div>
      </main>

      <Contact />
      <AskWidget />
    </>
  );
}