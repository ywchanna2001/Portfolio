/* ============================================================================
   SKILLS.TS — the Skills section.

   A flat, dense list: one group per row of chips. The aim is coverage — a
   recruiter scanning for a keyword should find it here.

   To add a skill, put it in the right array. To add a whole category, copy a
   block. Order matters: the first groups are the ones people read.
   ========================================================================== */

export type SkillGroup = {
  group: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    group: "Deep learning",
    items: ["TensorFlow", "Keras", "PyTorch", "JAX"],
  },
  {
    group: "LLMs & NLP",
    items: [
      "RAG",
      "Transformers",
      "LangChain",
      "HuggingFace",
      "Vector databases",
      "Pinecone",
      "Prompt engineering",
      "Agentic architectures",
    ],
  },
  {
    group: "Computer vision",
    items: ["YOLO", "OpenCV", "Roboflow", "Optical flow", "Object tracking"],
  },
  {
    group: "Data engineering",
    items: ["Apache Airflow", "Apache Spark", "Apache Hadoop", "ETL pipelines"],
  },
  {
    group: "Data science & ML libraries",
    items: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "SciPy"],
  },
  {
    group: "Programming languages",
    items: ["Python", "Java", "C", "R", "Prolog", "JavaScript"],
  },
  {
    group: "Cloud & deployment",
    items: ["Google Cloud Platform", "RunPod", "Docker", "Flask", "REST APIs"],
  },
  {
    group: "Databases",
    items: ["MSSQL", "MySQL","MongoDB", "PostgreSQL"],
  },
  {
    group: "Other tools & skills",
    items: ["Git", "Firebase" , "Model deployment", "Experiment tracking"],
  },
];