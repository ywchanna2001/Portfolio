/* ============================================================================
   KNOWLEDGE.TS — the retrieval half of the "Ask me anything" widget.

   Rather than maintain a separate copy of your biography for the chatbot, this
   flattens the same content files the page renders into a list of passages.
   Edit content/*.ts and the chatbot's knowledge updates with it — there is
   only ever one source of truth.
   ========================================================================== */

import { projects } from "@/content/projects";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import { publications, site } from "@/content/site";

export type Passage = {
  /** Shown to the visitor as the source of an answer. */
  source: string;
  text: string;
};

/** Flattens every content file into a flat list of retrievable passages. */
export function buildKnowledgeBase(): Passage[] {
  const passages: Passage[] = [];

  // Profile
  passages.push({
    source: "profile",
    text: `${site.name}. ${site.availability}. ${site.intro} ${site.about} Contact: ${site.email}, ${site.phone}.`,
  });

  // Education
  for (const degree of education) {
    passages.push({
      source: `education · ${degree.institution}`,
      text: `${degree.qualification}, ${degree.institution}, ${degree.location}, ${degree.period}. ${degree.note} Relevant coursework: ${degree.coursework.join(", ")}.`,
    });
  }

  // Experience
  for (const role of experience) {
    passages.push({
      source: `experience · ${role.org}`,
      text: `${role.title} at ${role.org}, ${role.period}. ${role.description}`,
    });
  }

  // Projects: one passage for the summary, one per case-study section.
  for (const p of projects) {
    passages.push({
      source: `project · ${p.title}`,
      text: `${p.title} (${p.category}${p.status ? `, ${p.status}` : ""}). ${p.tagline} Technologies: ${p.tags.join(", ")}. ${p.standfirst}`,
    });

    for (const section of p.sections) {
      const cards = (section.cards ?? [])
        .map((c) => `${c.title}: ${c.text}`)
        .join(" ");
      const body = [...section.body, cards].filter(Boolean).join(" ");
      if (!body.trim()) continue;
      passages.push({
        source: `${p.title} · ${section.heading}`,
        text: `${section.heading} — ${body}`,
      });
    }
  }

  // Publications
  for (const pub of publications) {
    passages.push({
      source: `publication · ${pub.title}`,
      text: `${pub.title} (${pub.kind}). ${pub.summary}`,
    });
  }

  // Skills
  for (const group of skillGroups) {
    passages.push({
      source: `skills · ${group.group}`,
      text: `${group.group}: ${group.items.join(", ")}.`,
    });
  }

  return passages;
}

/** Words too common to be worth matching on. */
const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "what", "which", "who", "how", "did", "do", "does", "is", "are", "was", "were",
  "you", "your", "he", "she", "his", "her", "it", "its", "that", "this", "at",
  "as", "by", "from", "about", "can", "tell", "me", "have", "has", "any", "some",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/**
 * Returns the `limit` passages most relevant to `query`.
 * Scoring: how many query terms a passage contains, weighted by how rare each
 * term is across the corpus — so "AlphaFold" counts for far more than "model".
 */
export function retrieve(query: string, limit = 4): Passage[] {
  const kb = buildKnowledgeBase();
  const terms = tokenize(query);
  if (terms.length === 0) return kb.slice(0, limit);

  // Document frequency for each term.
  const docFreq = new Map<string, number>();
  const tokenized = kb.map((p) => {
    const set = new Set(tokenize(`${p.source} ${p.text}`));
    for (const t of set) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
    return set;
  });

  const scored = kb.map((passage, i) => {
    let score = 0;
    for (const term of terms) {
      if (!tokenized[i].has(term)) {
        // Partial credit for prefix matches, so "cluster" finds "clustering".
        for (const word of tokenized[i]) {
          if (word.startsWith(term) || term.startsWith(word)) {
            score += 0.4;
            break;
          }
        }
        continue;
      }
      const df = docFreq.get(term) ?? 1;
      score += Math.log(1 + kb.length / df);
    }
    return { passage, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.passage);
}