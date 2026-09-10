/* ============================================================================
   SITE.TS — who you are, how to reach you, what the page says at the top.
   Edit anything here and it updates across the whole site.
   Anything wrapped in [square brackets] is a placeholder you should replace.
   ========================================================================== */

export const site = {
  // --- Identity -------------------------------------------------------------
  name: "Channa Dissanayaka",
  /** Shown in the browser tab and in link previews. */
  title: "Channa Dissanayaka — AI/ML Engineer",
  /** The monospace wordmark in the top-left corner. */
  wordmark: "channa.dissanayaka",
  /** The two letters in the little square logo. */
  monogram: "cd",
  /** Used for the canonical URL and social previews. Update after you deploy. */
  url: "https://channa.dev",

  // --- Hero -----------------------------------------------------------------
  /** The status line above the headline. */
  availability: "AI/ML Engineer · Colombo, Sri Lanka · Open to work",

  /**
   * The headline. `lead` is set in the sans font, `emphasis` in the italic
   * serif and teal — that contrast is what gives the hero its character.
   */
  headline: {
    lead: "I build production grade end to end AI/ML systems —",
    emphasis: "from the data pipeline to the deployed model.",
  },

  /** The paragraph under the headline. Keep it to 3–4 sentences. */
  intro:
  "BSc (Hons) in Artificial Intelligence, University of Moratuwa. 2+ years of building end-to-end AI solutions across agentic AI, NLP, computer vision and data engineering.",

  about:
  "Prospective graduate student with 2+ years of experience in building end-to-end AI solutions. Experienced in Agentic AI, NLP, data engineering, predictive modeling, computer vision, and scientific AI systems. Skilled in designing and deploying machine learning pipelines, building scalable data workflows using Apache Spark and Apache Airflow. Hands-on experience in translating advanced AI research into production-level code, optimizing deep learning architectures, and deploying cloud-native ML services.",


  // --- Contact --------------------------------------------------------------
  email: "ywchanna@gmail.com",
  phone: "+94 71 712 9791",
  contactHeading: {
    lead: "Let's build something",
    emphasis: "that actually ships.",
  },
  contactSub: "Open to AI/ML Engineer, Data Scientist and Research Engineer roles.",

  /**
   * Footer links. Replace every [your-handle] with your real profile URL —
   * a link that 404s is worse than no link at all.
   */
  links: [
    { label: "GitHub", href: "https://github.com/ywchanna2001" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/channa-dissanayaka-41ab7125a/" },
    { label: "Medium", href: "https://medium.com/@ywchanna" },
    { label: "Google Cloud", href: "https://www.skills.google/profile/badges?credential_type=skill_badge" },
  ],

  /**
   * Your CV. Put the PDF at  public/resume.pdf  and this link just works.
   * (A file in `public/` is served from the site root, so public/resume.pdf
   * is reachable at /resume.pdf.)
   */
  resumeHref: "/resume.pdf",

  /** Footer fine print. */
  colophon: "Built with Next.js, Tailwind CSS and 3Dmol.js",
};

/** The links in the sticky header. Each `href` is an #id on the home page. */
export const nav = [
  { label: "About", href: "/#about" },
  { label: "Education", href: "/#education" },
  { label: "Skills", href: "/#skills" },
  { label: "Pojects", href: "/#work" },
  { label: "Research", href: "/#research" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

/* ============================================================================
   PUBLICATIONS
   ========================================================================== */

export const publications = [
  {
    kind: "Preprint · Review",
    title: "The Evolution of the AlphaFold Architecture",
    /** TODO: paste the real abstract from your preprint. */
    summary:
      "A review paper analysing the architectural advancements behind protein structure prediction across the AlphaFold generations.",
    /** TODO: replace with the real link to your paper. */
    href: "https://www.preprints.org/manuscript/202601.0708",
    /** TODO: set the real publication year. */
    year: "2026",
    /** TODO: set the real citation. */
    citation: `@article{dissanayaka2026alphafold,
  title   = {The Evolution of the AlphaFold Architecture},
  author  = {Dissanayaka, Y. C. B. J.},
  journal = {Preprints},
  year    = {2026},
  number  = {2026010708},
  doi     = {10.20944/preprints202601.0708.v1},
  url     = {https://doi.org/10.20944/preprints202601.0708.v1}
`},
];

