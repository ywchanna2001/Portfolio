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
        media?: {
      kind: "video" | "image";
      src: string;
      /** Video only: a still shown before play. Strongly recommended. */
      poster?: string;
      /** Shown underneath in small grey text. */
      caption?: string;
      /** True for phone-shaped (9:16) recordings, e.g. a mobile app. */
      portrait?: boolean;
    };
  }[];
};

export const projects: Project[] = [
  /* ------------------------------------------------------------------------ */
    {
    slug: "alphafold-conformational-ensembles",
    title: "AlphaFold architecture-based protein conformational ensemble prediction",
    category: "Research",
    status: "Final-year research project",
    tagline:
      "An inference-time wrapper that makes AlphaFold2 predict alternative protein conformations without retraining it. DBSCAN partitions the MSA by evolutionary signals, then random column masking and retained dropout perturb each partition during inference. Matches the state of the art systems on the OC23 benchmark by achieving 78.3% accuracy using 100 models per target where competing methods need 1,000.",
    tags: ["AlphaFold2", "AI for Science", "Structural Biology", "ColabFold", "JAX", "DBSCAN", "MMseqs2"],
    featured: true,
    diagram: "alphafold",

    meta: [
      { label: "Role", value: "Sole researcher" },
      { label: "Supervisor", value: "Prof. Thushari Silva" },
      { label: "Stack", value: "Python · ColabFold · Biopython · JAX · scikit-learn" },
      { label: "Benchmark", value: "OC23 (23 proteins)" },
      { label: "Compute", value: "1 × A100 40GB, ~12 h" },
      { label: "Year", value: "2026" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/ywchanna2001/Protein_Conformational_Ensembles_Prediction.git" },
      { label: "Preprint", href: "https://www.preprints.org/manuscript/202601.0708" },
    ],

    heading: {
      lead: "Making AlphaFold generate",
      emphasis: "more than one answer — without retraining it.",
    },
    standfirst:
      "Proteins move; AlphaFold2 returns one structure. This thesis proposes an inference-time wrapper that recovers alternative conformations by partitioning a protein's evolutionary history and perturbing each partition as it passes through the network. It resolves both states for 18 of 23 OC23 targets — equalling AFsample2 — at a tenth of the sampling budget.",

    stats: [
      { value: "78.3%", label: "OC23 success rate · 18 of 23 targets" },
      { value: "10×", label: "Lower sampling budget than baselines" },
      { value: "100", label: "Models per target (K=10 × M=10)" },
    ],

    sections: [
      {
        id: "problem",
        eyebrow: "01 — Problem",
        heading: "One protein, many shapes, one prediction.",
        body: [
          "AlphaFold2 predicts static structures at near-experimental accuracy, but natively dynamic proteins exist as conformational ensembles — open and closed states, fold switches, apo and holo forms. A single predicted structure misses the states that often matter most for function and for drug discovery.",
          "Methods that do recover alternative states hit the same bottleneck from two directions. Sampling approaches such as AFsample2 and AF-Cluster brute-force the problem, generating on the order of a thousand structural decoys per target to achieve coverage. Generative approaches such as AlphaFlow avoid that cost at inference but depend on training over expensive molecular dynamics simulations. Either way the barrier is compute, which puts conformational ensemble prediction out of reach on accessible hardware.",
          "The gap this thesis addresses: an accurate framework for predicting conformational ensembles that runs within a single consumer-grade GPU budget.",
        ],
      },
      {
        id: "approach",
        eyebrow: "02 — Approach",
        heading: "Separate the evolutionary signals, then perturb each one.",
        body: [
          "The hypothesis is that alternative conformations are already embedded in a protein's evolutionary history, and can be recovered by partitioning its multiple sequence alignment into sub-clusters before applying targeted stochastic perturbation at inference.",
          "This matters because a protein's alternative state is usually supported by a minority of homologues. Subsample the MSA at random and that signal is diluted by the larger group supporting the dominant conformation. Density-based clustering separates the signals before they reach the network, so a minority state gets its own alignment rather than being averaged away.",
          "Perturbation is then applied at two independent levels — one to the input, one inside the network. Because they act at different levels they compose rather than duplicate, which is what lets the pipeline escape the single dominant conformation the training objective favours. Nothing is retrained: the whole method is a wrapper around pre-trained AlphaFold2 weights, which also means it carries forward to later versions of the model.",
        ],
        cards: [
          {
            kicker: "Partition",
            title: "DBSCAN over the MSA",
            text: "One-hot encoded homologues clustered by evolutionary similarity; ε chosen to maximise cluster count. K = 10 sub-MSAs selected.",
          },
          {
            kicker: "Stochastic 1",
            title: "Random column masking",
            text: "A fraction ρ = 0.15 of alignment columns replaced with the unknown-residue token in every homologue row. The query row is left intact.",
          },
          {
            kicker: "Stochastic 2",
            title: "Inference-time dropout",
            text: "Evoformer dropout retained during the forward pass (0.15 MSA stack, 0.25 pair stack), so identical input follows different paths.",
          },
        ],
      },
      {
        id: "architecture",
        eyebrow: "03 — Architecture",
        heading: "Four modules, one forward direction.",
        body: [
          "The system is a pipeline of four modules that communicate through files on disk rather than shared memory, so each can be run, inspected and tested independently. Three lie on the prediction path; the fourth exists only for benchmarking.",
          "Pre-processing takes a FASTA sequence, builds an alignment with MMseqs2 against UniRef30 and an environmental database, discards homologues with a gap fraction above 0.25, and partitions the remainder with DBSCAN into K = 10 sub-MSAs. The inference engine applies column masking to each sub-MSA and runs AlphaFold2 with dropout retained, M = 10 times per cluster — 100 structures per target, each written with its pLDDT and pTM confidence. Visualization renders the ensemble interactively with py3Dmol, and is the only output for a target with no known alternative state.",
          "Keeping evaluation off the prediction path is a deliberate design decision rather than an organisational one. The open and closed labels derive from the reference structures, and those are visible only inside the evaluation module — so the prediction path is blind to the ground truth it is later measured against.",
        ],
      },
      {
        id: "results",
        eyebrow: "04 — Results",
        heading: "State-of-the-art accuracy at a tenth of the cost.",
        body: [
          "Evaluated on OC23, a standard benchmark of 23 structurally diverse proteins with experimentally determined open and closed states. A target counts as solved only when the ensemble contains at least one model scoring TM > 0.8 against both states, measured with TM-align at a fixed d₀ of 3.5 Å.",
          "The pipeline resolved both conformations for 18 of 23 targets — a 78.3% success rate — with average peak TM-scores of 0.844 to state 1 and 0.891 to state 2, and an average path fill-ratio of 0.181. That equals AFsample2, the strongest published baseline, which needs 1,000 models per target against this pipeline's 100: a 90% reduction in forward passes. Against AF-Cluster, which partitions the MSA but applies no stochastic perturbation, the improvement is 30.5 percentage points — evidence that clustering alone is insufficient to trigger a conformational transition.",
          "The five failures are informative. O76728 and P00558 each collapsed onto one state (best scores of 0.59/0.96 and 0.95/0.58 respectively), which is the signature of a dominant co-evolutionary signal that a 15% masking fraction cannot overcome. Where the pipeline works well it maps the pathway, not just the endpoints: A2RJ53 produced a continuous distribution between both states with a fill-ratio of 0.418, indicating that transition intermediates were sampled rather than only the two extremes.",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Honest notes on the limits.",
        body: [
          "Two limitations are structural rather than incidental. Targets with very stable ground states behind high energy barriers resist a fixed 15% masking fraction and collapse back to the dominant conformation — the perturbation is uniform where the problem is not. And the whole method inherits DBSCAN's dependence on MSA diversity: if the alternative state is represented by only a handful of sequences, clustering labels them noise and discards them, and no amount of downstream perturbation recovers a signal that was thrown away before inference.",
          "The fix I would try first is an adaptive masking fraction — predicting per-cluster how much of the alignment to mask, rather than applying one rate everywhere, so the co-evolutionary core is preserved while transition sampling is accelerated where it is needed. Beyond that, the wrapper is deliberately architecture-agnostic, so porting it to AlphaFold3 and multi-chain complexes is the natural next step.",
          "The lesson I took from the build itself: the win came from composing two perturbations that act at different levels, not from making either one stronger. AF-Cluster clusters but does not perturb; AFsample perturbs but does not cluster. Doing both, cheaply, is what bought the 10×.",
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
      "A coffee-shop assistant that takes orders, answers menu questions, filters off-topic chat, and recommends products with a Market Basket Analysis engine. Llama-based LLM and embeddings were deployed on RunPod, RAG over Pinecone, Firebase backend, React Native app.",
    tags: ["Llama", "RunPod", "Pinecone", "React Native"],
    diagram: "agents",

    meta: [
      { label: "Role", value: "Solo build, end to end" },
      { label: "Stack", value: "Llama · Pinecone · Firebase · React Native · Python · Runpod" },
      { label: "Client", value: "React Native" },
      { label: "Status", value: "Completed" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/ywchanna2001/Coffee_Shop_Chatbot.git" }],

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
          "To be added...",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Further Improvements.",
        body: [
          "To be added...",
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
      { label: "Stack", value: "YOLOv8 · OpenCV · Python · scikit-learn" },
      { label: "Input", value: "Broadcast video" },
      { label: "Output", value: "Speed · distance · position detecting players, ball and referees" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/ywchanna2001/AI-ML-Football-Analysis-system.git" }],

    heading: {
      lead: "Turning broadcast footage into",
      emphasis: "numbers you can actually coach with.",
    },
    standfirst:
      "Broadcast football video is a moving camera pointed at 22 people in two colours. This system detects and tracks every player, works out which team they belong to, cancels out the camera's own motion, and calculates velocity of each palyer, referees and ball. Also this system calculates the distance each player covered.",

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
          "",
        ],
        media: {
          kind: "video",
          src: "/demo-football.mp4",
          poster: "/demo-football-poster.jpg",
          caption:
            "Annotated output: player and ball detection, team colours assigned by K-Means, and per-player speed and distance estimated after camera-motion correction.",
        },
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Future improvements.",
        body: [
          "To be added...",
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
          "To be added...",
        ],
      },
      {
        id: "reflection",
        eyebrow: "05 — What I'd change",
        heading: "Further Improvements.",
        body: [
          "To be added...",
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
