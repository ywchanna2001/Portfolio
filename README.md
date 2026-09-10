# Channa Dissanayaka — portfolio

A dark "observatory" portfolio built with Next.js, Tailwind CSS and 3Dmol.js.

This README assumes you know Python and ML but are new to Next.js and Tailwind.
Nothing here requires you to learn either in depth — the site is built so that
**all the writing lives in `content/`**, separate from the code.

---

## 1. Run it on your machine

You need Node.js 20 or newer. Check with `node -v`; if you don't have it,
install from <https://nodejs.org> (take the LTS version).

```bash
npm install     # once, to download dependencies
npm run dev     # start the dev server
```

Open <http://localhost:3000>. Edit any file and the page updates as you save.

Two other commands you'll use:

```bash
npm run build   # production build — run this before deploying to catch errors
npm run start   # serve the production build locally
```

---

## 2. Where to change things

**You will spend almost all your time in `content/`.** These are plain
TypeScript files — think of them as structured config, not code.

| File | What's in it |
|---|---|
| `content/site.ts` | Your name, the hero headline, the intro paragraph, the four metrics, contact details, social links, publications |
| `content/projects.ts` | Every project: the home-page card **and** its full case-study page |
| `content/experience.ts` | The experience/education timeline |
| `content/skills.ts` | The "skills with receipts" section |

Everything wrapped in `[square brackets]` is a placeholder waiting for you.
Search the project for `[` to find them all.

The rest of the structure:

```
app/
  layout.tsx              page shell, fonts, SEO metadata
  page.tsx                the home page (just assembles the sections)
  work/[slug]/page.tsx    ONE file that renders EVERY case study
  api/ask/route.ts        the backend for the chat widget
  globals.css             colours, fonts and shared styles  ← design tokens live here
components/               one file per section of the page
lib/knowledge.ts          turns content/ into passages the chatbot can search
public/                   put resume.pdf and your images here
```

### Changing colours or fonts

Open `app/globals.css` and look at the `@theme { ... }` block at the top.
That is the whole palette. Change `--color-accent` and the teal changes
everywhere — buttons, links, tags, chart bars, the glow.

Tailwind v4 has no `tailwind.config.js`; the theme is defined in CSS.

---

## 3. Adding a new project

1. Open `content/projects.ts`.
2. Copy an existing entry in the `projects` array and change the fields.
3. Give it a unique `slug` (lowercase, hyphens) — that becomes its URL.

That's it. The card appears on the home page and `/work/<your-slug>` starts
working. You never touch the page code.

To link a skill to it, add the same slug to an `evidence` array in
`content/skills.ts`.

---

## 4. The 3D protein viewer

`components/ProteinViewer.tsx` loads 3Dmol.js from a CDN and fetches a real
structure from the RCSB Protein Data Bank.

The defaults are **4AKE** (open) and **1AKE** (closed) — adenylate kinase, the
textbook protein with two conformations, which is exactly what your research is
about. To use a different structure, change the `CONFORMATIONS` array near the
top of that file; any four-character PDB ID works.

If the CDN or the PDB is unreachable, an animated SVG fallback is shown
instead, so the hero never looks broken.

---

## 5. The "Ask me anything" chatbot

It answers questions about you using **your own content files** — there is no
separate knowledge base to keep in sync.

**It already works with no setup**, in retrieval-only mode: it finds the most
relevant passages and shows them. To get properly written answers, add an
Anthropic API key:

1. Create a file named `.env.local` in the project root.
2. Put one line in it:

   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. Restart `npm run dev`.

`.env.local` is already in `.gitignore` — **never commit an API key.**

If the key is missing or the API call fails, it silently falls back to
retrieval-only. The widget never shows an error to a recruiter.

There is a simple rate limit (8 questions per minute per IP) in
`app/api/ask/route.ts` so nobody can run up your API bill.

---

## 6. Deploying to Vercel (free)

1. Push this folder to a new GitHub repository:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```

2. Go to <https://vercel.com>, sign in with GitHub, click **Add New → Project**,
   and pick the repository. Vercel detects Next.js automatically — accept every
   default and click **Deploy**.

3. If you're using the chatbot: **Project Settings → Environment Variables**,
   add `ANTHROPIC_API_KEY`, then redeploy.

4. Custom domain: **Project Settings → Domains**. Buy a domain from Namecheap,
   Porkbun or Cloudflare (a `.dev` is about $12/year) and follow Vercel's DNS
   instructions. Then update `site.url` in `content/site.ts`.

Every `git push` after that redeploys automatically.

---

## 7. Before you share the link

- [ ] Add your CV as `public/resume.pdf`
- [ ] Replace every `[your-handle]` in `content/site.ts` with real profile URLs
- [ ] Replace every `[link-to-repo]` in `content/projects.ts`
- [ ] Fill in the bracketed results and reflection sections in each case study
- [ ] Add screenshots or GIFs — especially the football tracker and the chatbot
- [ ] Set the real year on the preprint citation
- [ ] Check it on your phone
- [ ] Run `npm run build` and make sure it passes

The single highest-value item on that list is **a short screen recording of the
football tracker and the chatbot running**. Case-study text is good; watching
the thing work is better.
