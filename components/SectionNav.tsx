"use client";

import { useEffect, useState } from "react";

/**
 * The sticky table of contents beside a case study. The current section is
 * highlighted as you scroll, so a long page never feels like a wall of text.
 * Hidden on small screens, where there is no room for a second column.
 */
export default function SectionNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport that is visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections" className="hidden lg:block">
      <ul className="sticky top-28 flex flex-col gap-3.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`font-mono text-xs uppercase tracking-wide transition-colors ${
                active === s.id ? "text-accent" : "text-dim hover:text-body"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
