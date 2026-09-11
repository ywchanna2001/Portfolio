# Channa Dissanayaka — Portfolio

Personal portfolio and project case studies for **Channa Dissanayaka**, AI/ML Engineer and BSc (Hons) Artificial Intelligence graduate of the University of Moratuwa, Sri Lanka.

**Live site:** [channa-portfolio.vercel.app](https://portfolio-phi-inky-78.vercel.app/)

Built as a static Next.js site with a dark "observatory" design system, a 3D protein structure viewer tied to my final-year research, and a retrieval-augmented chat assistant that answers questions about my work.

---

## Features

**Case studies of the selected projects.** Each project has a dedicated page following the same structure — problem, approach, architecture, results, and an honest reflection on what I'd change. Architecture diagrams are hand-drawn inline SVG, so they stay sharp at any size and adapt to the theme.

**Live 3D protein viewer.** The hero renders a real structure from the RCSB Protein Data Bank using 3Dmol.js — adenylate kinase in its open (4AKE) and closed (1AKE) conformations, which is the exact phenomenon my AlphaFold research addresses. Visitors can rotate it and toggle between states. An animated SVG fallback renders if the CDN or PDB is unreachable, so the hero never appears broken.

**"Ask me anything" assistant.** A chat widget answers questions about my experience using retrieval over this repository's own content files. Relevant passages are scored with TF-IDF-style keyword weighting and, when an API key is configured, passed to a LLM with instructions to answer strictly from that context. Without a key it degrades gracefully to returning the retrieved passages verbatim — the widget never errors out in front of a visitor.

**Single source of truth for content.** Every piece of text on the site lives in four typed files under `content/`. The chat assistant reads the same files, so there is no second copy of my biography to keep in sync.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 — design tokens defined in CSS, no config file |
| 3D rendering | 3Dmol.js, loaded lazily from CDN |
| LLM | Anthropic Claude API (optional; retrieval-only fallback) |
| Hosting | Vercel |
| Type | Static — home page and all case studies pre-rendered at build time |

Deliberately no animation library, no UI kit, and no state manager. Scroll reveals use `IntersectionObserver` directly, and the retrieval layer is ~50 lines rather than a vector database — at this corpus size, a hosted vector store would be slower, cost money, and be no more accurate.

---

## Project structure

```
app/
  layout.tsx              root layout, fonts, SEO metadata
  page.tsx                home page — composes the section components
  work/[slug]/page.tsx    one file that renders every case study
  api/ask/route.ts        retrieval + LLM endpoint for the chat widget
  globals.css             design tokens (colours, type, motion)
components/               one component per section, plus shared pieces
content/
  site.ts                 identity, hero, about, contact, publications
  projects.ts             projects and their full case studies
  education.ts            degree and coursework
  skills.ts               skill groups
lib/knowledge.ts          flattens content/ into retrievable passages
public/                   résumé PDF and static assets
```

Adding a project means adding one object to `content/projects.ts`. Its card and its page at `/work/<slug>` are generated automatically.

---

## Running locally

Requires Node.js 20 or newer.

```bash
git clone https://github.com/ywchanna2001/Portfolio.git
cd portfolio
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build    # production build
npm run start    # serve the production build
```

### Optional: enabling LLM answers

The chat widget works without configuration, returning retrieved passages. For generated answers, create `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

The endpoint rate-limits to 8 requests per minute per IP and falls back to retrieval-only on any API failure.

---

## Deployment

Deployed on Vercel. Every push to `main` triggers a rebuild. All routes except `/api/ask` are pre-rendered as static HTML and served from the CDN.

---

## Contact

**Channa Dissanayaka**
ywchanna@gmail.com · [LinkedIn](www.linkedin.com/in/channa-dissanayaka-41ab7125a) · [Preprints](https://www.preprints.org/manuscript/202601.0708)

---

## License

The source code in this repository is available under the MIT License. The written content, case studies, CV and personal imagery are © Channa Dissanayaka and not licensed for reuse.
