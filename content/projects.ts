/* ============================================================================
   PROJECTS.TS — one entry per project.

   Each project appears twice:
     1. as a card on the home page (slug, title, tagline, tags, category)
     2. as its own case-study page at /work/<slug>  (everything else)

   The case study follows the same five beats every time, because that is how
   you would walk an interviewer through the work:
     problem  ->  approach  ->  architecture  ->  results  ->  reflection

   Anything in [square brackets] is a placeholder for you to fill in.
   ========================================================================== */

export type Project = {
  /** URL segment: /work/<slug>. Lowercase, hyphens, no spaces. */
  slug: string;
  title: string;
  /** Short label on the card, e.g. "Research", "Agentic AI". */
  category: string;
  /** Optional second label, e.g. "Ongoing". */
  status?: string;
  /** One or two sentences on the home-page card. */
  tagline: string;
  /** Technology chips. Keep to 3–5 so the card stays readable. */
  tags: string[];
  /** `true` puts it in the large highlighted card at the top of the grid. */
  featured?: boolean;
  /** Which diagram to draw on the card / case study. See components/diagrams. */
  diagram?: "alphafold" | "agents" | "vision" | "carbon";

  /** Case-study header facts, shown in the small grid on the right. */
  meta: { label: string; value: string }[];
  links: { label: string; href: string }[];

  /** The headline on the case-study page (same two-part shape as the hero). */
  heading: { lead: string; emphasis: string };
  /** The standfirst paragraph under it. */
  standfirst: string;

  /** Optional big numbers beside the results figure. */
  stats?: { value: string; label: string }[];

  /** The five sections of the case study. */
  sections: {
    id: string;
    eyebrow: string;
    heading: string;
    /** Each string is one paragraph. */
    body: string[];
    /** Optional set of small cards under the text. */
    cards?: { kicker: string; title: string; text: string }[];
  }[];
};

export const projects: Project[] = [
  /* ------------------------------------------------------------------------ */
  {
    slug: "alphafold-conformational-ensembles",
    title: "AlphaFold-based protein conformational ensemble prediction",
    category: "Research",
    status: "Final-year thesis",
    tagline:
      "A training-free, inference-time pipeline that coaxes AlphaFold into sampling multiple conformations. Localized random column masking of the MSA plus active inference-time dropout, with DBSCAN clustering to pick representative states. 78.3% success on OC23 while generating only 100 models per target.",
    tags: ["PyTorch", "JAX", "ColabFold", "DBSCAN"],
    featured: true,
    diagram: "alphafold",

    meta: [
      { label: "Role", value: "Final-year researcher" },
      { label: "Stack", value: "PyTorch · JAX · ColabFold" },
      { label: "Benchmark", value: "OC23" },
      { label: "Year", value: "2025–26" },
    ],
    links: [
      { label: "GitHub", href: "[link-to-repo]" },
      { label: "Preprint", href: "[link-to-your-preprint]" },
    ],

    heading: {
      lead: "Making AlphaFold sample",
      emphasis: "more than one answer — without retraining it.",
    },
    standfirst:
      "Proteins move. AlphaFold gives you one structure. This project is an inference-time pipeline that turns a single prediction into a conformational ensemble — reaching 78.3% success on the OC23 benchmark with a tenth of the compute of ensemble baselines.",

    stats: [
      { value: "78.3%", label: "Success rate · OC23" },
      { value: "10×", label: "Reduction in compute" },
      { value: "100", label: "Models per target [vs. baseline N]" },
    ],

    sections: [
      {
        id: "problem",
        eyebrow: "01 — Problem",
        heading: "One protein, many shapes, one prediction.",
        body: [
          "AlphaFold predicts a single, static structure per sequence, but many proteins switch between functionally distinct conformations — open and closed states, apo and holo forms. Existing approaches to recover that diversity either retrain the model or brute-force it with hundreds to thousands of stochastic samples per target, which is expensive and slow.",
          "The goal: recover multiple conformations at inference time, cheaply, with no training.",
        ],
      },
      {
        id: "approach",
        eyebrow: "02 — Approach",
        heading: "Two sources of randomness, then cluster.",
        body: [
          "The pipeline is dual-stochastic. First, localized random column masking perturbs the multiple-sequence alignment so that co-evolutionary signal is partially hidden in different regions on each run. Second, dropout is kept active during inference, injecting noise inside the network. Each run yields a slightly different structure; DBSCAN clusters the 100 outputs by structural similarity, and cluster representatives form the ensemble. No weights are touched.",
        ],
        cards: [
          {
            kicker: "Stochastic 1",
            title: "Localized column masking",
            text: "Random contiguous MSA columns masked per run.",
          },
          {
            kicker: "Stochastic 2",
            title: "Inference-time dropout",
            text: "Dropout kept active during the forward pass.",
          },
          {
            kicker: "Selection",
            title: "DBSCAN clustering",
            text: "Density-based grouping of the 100 models into states.",
          },
        ],
      },
      {
        id: "architecture",
        eyebrow: "03 — Architecture",
        heading: "The pipeline, end to end.",
        body: [],
      },
      {
        id: "results",
        eyebrow: "04 — Results",
        heading: "78.3% of OC23 targets, at a tenth of the cost.",
        body: [
          "Evaluated on the standardized OC23 open/closed conformation dataset, the pipeline recovered both states for 78.3% of targets while generating only 100 models per target — roughly a 10× reduction in compute against sampling-based baselines.",
          "[Add here: the per-target TM-score table, a rendered open/closed overlay image, and a short failure-case analysis from your thesis. Concrete numbers and a picture of a failure case are what make a results section credible.]",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Honest notes for next time.",
        body: [
          "[Write 3–4 sentences in your own voice: which hyper-parameters were most sensitive, where DBSCAN struggled, what you would try with AlphaFold 3 or a diffusion-based sampler, and what genuinely surprised you. This is the section interviewers read most carefully — it shows judgement, not just execution.]",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "multi-agent-customer-service-chatbot",
    title: "Multi-agent customer service chatbot",
    category: "Agentic AI",
    status: "Ongoing",
    tagline:
      "A coffee-shop assistant that takes orders, answers menu questions, filters off-topic chat, and recommends products with a Market Basket Analysis engine. Llama-based LLM and embeddings on RunPod, RAG over Pinecone, Firebase backend, React Native app.",
    tags: ["Llama", "RunPod", "Pinecone", "React Native"],
    diagram: "agents",

    meta: [
      { label: "Role", value: "Solo build, end to end" },
      { label: "Stack", value: "Llama · Pinecone · Firebase" },
      { label: "Client", value: "React Native" },
      { label: "Status", value: "Ongoing" },
    ],
    links: [{ label: "GitHub", href: "[link-to-repo]" }],

    heading: {
      lead: "One chat box,",
      emphasis: "four agents behind it.",
    },
    standfirst:
      "A full-stack AI customer service assistant for a coffee shop. It takes orders, answers menu queries, refuses to be dragged off-topic, and recommends what to add to the basket — with each of those concerns handled by its own agent rather than one overloaded prompt.",

    sections: [
      {
        id: "problem",
        eyebrow: "01 — Problem",
        heading: "A single prompt cannot do four jobs well.",
        body: [
          "A shop assistant has to do several different things at once: understand an order precisely enough to charge for it, answer questions about the menu without inventing items, stay on topic when a customer wanders, and suggest a sensible add-on. Pushing all of that into one prompt makes each job worse — the model hallucinates menu items, loses the order state, or happily discusses the weather.",
        ],
      },
      {
        id: "approach",
        eyebrow: "02 — Approach",
        heading: "Separate the concerns, ground the answers.",
        body: [
          "The system is split into modular agents that route between each other: a guard agent that filters irrelevant conversation, an order-taking agent that maintains structured order state, a FAQ agent grounded in retrieval, and a recommendation agent driven by Market Basket Analysis over historical orders.",
          "Menu and business answers are grounded with Retrieval-Augmented Generation over a Pinecone vector database, so the assistant quotes the real menu rather than a plausible one.",
        ],
        cards: [
          {
            kicker: "Routing",
            title: "Guard + classifier",
            text: "Filters off-topic messages before they reach an agent.",
          },
          {
            kicker: "Grounding",
            title: "RAG over Pinecone",
            text: "Menu and business data retrieved, not remembered.",
          },
          {
            kicker: "Upsell",
            title: "Market Basket Analysis",
            text: "Association rules over past orders drive recommendations.",
          },
        ],
      },
      {
        id: "architecture",
        eyebrow: "03 — Architecture",
        heading: "From phone to GPU and back.",
        body: [
          "A Llama-based LLM and the embedding models are deployed on RunPod GPU infrastructure. Firebase holds orders, the menu and app data. The client is a React Native mobile app that talks to both.",
        ],
      },
      {
        id: "results",
        eyebrow: "04 — Results",
        heading: "What it does today.",
        body: [
          "[Add here: how the assistant performs on your own test conversations — order accuracy, how often the guard agent correctly rejects off-topic input, retrieval hit rate, and end-to-end latency. Even rough numbers from 50 hand-written test cases beat no numbers.]",
          "[A short screen recording of a real ordering conversation would be the single most persuasive thing on this page.]",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Honest notes.",
        body: [
          "[Write in your own voice: what the agent split bought you and what it cost in latency, where RAG still returns the wrong chunk, and whether Market Basket Analysis was the right call versus a simpler heuristic.]",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "football-analysis-system",
    title: "Football analysis system",
    category: "Computer vision",
    tagline:
      "YOLOv8 player detection and tracking on a custom dataset, K-Means team classification, optical-flow camera compensation, and perspective transforms to estimate speed, distance and positioning from broadcast footage.",
    tags: ["YOLOv8", "OpenCV", "K-Means"],
    diagram: "vision",

    meta: [
      { label: "Role", value: "Solo build" },
      { label: "Stack", value: "YOLOv8 · OpenCV · scikit-learn" },
      { label: "Input", value: "Broadcast video" },
      { label: "Output", value: "Speed · distance · position" },
    ],
    links: [{ label: "GitHub", href: "[link-to-repo]" }],

    heading: {
      lead: "Turning broadcast footage into",
      emphasis: "numbers you can actually coach with.",
    },
    standfirst:
      "Broadcast football video is a moving camera pointed at 22 people in two colours. This system detects and tracks every player, works out which team they belong to, cancels out the camera's own motion, and maps the picture onto the real pitch so distances mean something.",

    sections: [
      {
        id: "problem",
        eyebrow: "01 — Problem",
        heading: "The camera moves, and pixels are not metres.",
        body: [
          "Two things break naive tracking on broadcast footage. The camera pans and zooms, so a stationary player still moves across the frame. And the image is a perspective projection — ten pixels near the touchline and ten pixels at the far side of the pitch are very different real distances. Any speed or distance figure computed in pixel space is meaningless.",
        ],
      },
      {
        id: "approach",
        eyebrow: "02 — Approach",
        heading: "Detect, assign, stabilise, project.",
        body: [
          "A YOLOv8 model trained on a custom dataset detects and tracks players frame to frame. Team assignment is unsupervised: K-Means clusters the pixels of each player's shirt region, so no manual labelling of kit colours is needed. Optical flow estimates the camera's own motion between frames and subtracts it. Finally an OpenCV perspective transform maps image coordinates onto pitch coordinates, at which point speed, distance covered and positional movement are real quantities in metres.",
        ],
        cards: [
          {
            kicker: "Detection",
            title: "YOLOv8, custom dataset",
            text: "Players, ball and referees detected and tracked per frame.",
          },
          {
            kicker: "Assignment",
            title: "K-Means on shirt pixels",
            text: "Teams separated by colour, with no manual labels.",
          },
          {
            kicker: "Correction",
            title: "Optical flow + homography",
            text: "Camera motion removed, image mapped onto the pitch.",
          },
        ],
      },
      {
        id: "architecture",
        eyebrow: "03 — Architecture",
        heading: "The frame pipeline.",
        body: [],
      },
      {
        id: "results",
        eyebrow: "04 — Results",
        heading: "What comes out the other end.",
        body: [
          "[Add here: detection mAP on your held-out clips, tracking stability (how often an ID switches), and a sanity check of estimated speeds against known values — a sprint should come out around 8–9 m/s, and if it does not, say so.]",
          "[Embed a short annotated clip here. This project is inherently visual; a 15-second GIF of the tracker running is worth more than three paragraphs.]",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Honest notes.",
        body: [
          "[Write in your own voice: where tracking fails — occlusions, players in similar kit, the goalkeeper — and what you would try next, such as re-identification embeddings or a calibrated pitch model.]",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: "carbon-footprint-monitoring",
    title: "AI-assisted carbon footprint monitoring for food supply chains",
    category: "ML platform · GCP",
    tagline:
      "Estimates CO₂e from farm to market. Emission prediction models served through Flask REST APIs on Google Cloud, a Spring Boot backend, and a React front end.",
    tags: ["Flask", "Spring Boot", "React", "GCP"],
    diagram: "carbon",

    meta: [
      { label: "Role", value: "ML + full stack" },
      { label: "ML serving", value: "Flask on GCP" },
      { label: "Backend", value: "Spring Boot" },
      { label: "Frontend", value: "React" },
    ],
    links: [{ label: "GitHub", href: "[link-to-repo]" }],

    heading: {
      lead: "Putting a number on",
      emphasis: "the distance your food travelled.",
    },
    standfirst:
      "A platform that estimates CO₂e emissions across a food supply chain, from farm to market — machine learning models for emission prediction, wrapped in APIs and a front end that someone who is not a data scientist can actually use.",

    sections: [
      {
        id: "problem",
        eyebrow: "01 — Problem",
        heading: "Emissions data exists, but not where decisions are made.",
        body: [
          "Estimating the carbon cost of getting food from a farm to a market involves many small contributions — transport legs, storage, processing — and the people who could act on that number are rarely the people who can run a model. The problem is as much delivery as it is prediction.",
        ],
      },
      {
        id: "approach",
        eyebrow: "02 — Approach",
        heading: "Model it, then wrap it in something usable.",
        body: [
          "Emission prediction models estimate CO₂e for each stage of the chain. Those models are served behind Flask REST APIs deployed on Google Cloud Platform, with a Spring Boot backend handling application data and a React front end presenting the results.",
          "[Add here: what features the models use, what data you trained on, and which model type you settled on and why.]",
        ],
      },
      {
        id: "architecture",
        eyebrow: "03 — Architecture",
        heading: "Four pieces, cleanly separated.",
        body: [],
      },
      {
        id: "results",
        eyebrow: "04 — Results",
        heading: "Accuracy and what it enabled.",
        body: [
          "[Add here: model error (MAE/RMSE) against your test set and a baseline to compare it to, plus a screenshot of the dashboard. A screenshot matters here — this is the most product-like thing in your portfolio.]",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Honest notes.",
        body: [
          "[Write in your own voice: whether the Spring Boot + Flask split was worth the operational cost, where the emission estimates are weakest, and what data you wish you had.]",
        ],
      },
    ],
  },
];

/** Look up one project by its slug. Used by the /work/[slug] page. */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The previous and next project, for the links at the foot of a case study. */
export function getProjectNeighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? projects[i - 1] : projects[projects.length - 1],
    next: i < projects.length - 1 ? projects[i + 1] : projects[0],
  };
}
