/* ============================================================================
   EDUCATION.TS — the Education section.
   Add another entry to the array if you do a masters or a certification.
   ========================================================================== */

export type Degree = {
  qualification: string;
  institution: string;
  location: string;
  period: string;
  /** One or two sentences. Leave as "" to hide it. */
  note: string;
  /** Modules shown as chips. Add or remove freely. */
  coursework: string[];
};

export const education: Degree[] = [
  {
    qualification: "BSc (Hons) in Artificial Intelligence",
    institution: "University of Moratuwa",
    location: "Sri Lanka",
    period: "2022 — 2026",
    note: "Four-year honours degree covering the full stack of modern AI — from the statistical foundations through deep learning to multi-agent systems and expert systems.",
    coursework: [
      "Machine Learning",
      "Deep Learning",
      "Artificial Neural Networks",
      "Natural Language Processing",
      "Machine Vision",
      "Big Data & Data Warehousing",
      "Expert Systems",
      "Multi-Agent Systems",
      "Time Series Analysis and Forecasting",
      "Computational Statistics",
    ],
  },
];