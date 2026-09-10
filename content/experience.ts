/* ============================================================================
   EXPERIENCE.TS — the timeline in the "Experience" section.
   Newest first. Keep each description to one or two sentences.
   ========================================================================== */

export type Role = {
  period: string;
  title: string;
  org: string;
  description: string;
};

export const experience: Role[] = [
  {
    period: "Feb 2025 — Aug 2025",
    title: "Intern ML Engineer",
    org: "Orysys",
    description:
      "Built a RAG chatbot, modifying and integrating advanced reasoning algorithms to improve response quality and contextual understanding. Owned scalable ML data pipelines that automated extraction schedules for large-scale financial datasets, optimising the workflows with Apache Spark, Hadoop and Airflow.",
  },
  {
    period: "Jan 2023 — Present",
    title: "Freelance AI/ML Developer",
    org: "Fiverr",
    description:
      "Delivered end-to-end AI/ML solutions for international and local clients, specialising in computer vision, predictive modelling and custom machine learning applications.",
  },
];