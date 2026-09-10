import { skillGroups } from "@/content/skills";
import Reveal from "./Reveal";
import Section from "./Section";

/**
 * The Skills section — a dense grid of categories, each a row of chips.
 * Nothing here is a link; it is a scannable inventory of what you know.
 */
export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="03 — Skills"
      heading="The toolkit."
      aside="Languages, frameworks and platforms I've worked with hands-on."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.group} delay={(i % 3) * 60}>
            <div className="flex h-full flex-col gap-4 rounded-xl border border-line bg-panel/40 p-6 transition-colors hover:border-accent/30">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
                {group.group}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}