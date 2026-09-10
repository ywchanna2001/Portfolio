/* ============================================================================
   DIAGRAMS

   Hand-drawn SVG architecture diagrams, one per project. They are inline SVG
   rather than images so they stay crisp at any size, recolour with the theme,
   and weigh nothing.

   Each diagram is a row of labelled boxes joined by curved connectors. To add
   one for a new project: copy the closest example, change the labels, and add
   its key to the `diagram` field in content/projects.ts.
   ========================================================================== */

const BOX = "rgba(255,255,255,0.04)";
const BOX_LINE = "rgba(255,255,255,0.18)";
const HL = "rgba(79,227,193,0.08)";
const HL_LINE = "rgba(79,227,193,0.5)";
const OUT = "rgba(60,124,240,0.12)";
const OUT_LINE = "rgba(60,124,240,0.6)";
const WIRE = "rgba(231,235,243,0.35)";

/** One labelled box. */
function Node({
  x,
  y,
  w = 120,
  h = 70,
  title,
  sub,
  tone = "plain",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  tone?: "plain" | "accent" | "output";
}) {
  const fill = tone === "accent" ? HL : tone === "output" ? OUT : BOX;
  const stroke = tone === "accent" ? HL_LINE : tone === "output" ? OUT_LINE : BOX_LINE;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" fill="#E7EBF3" fontSize={12}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fill="#8B95A9" fontSize={12}>
          {sub}
        </text>
      )}
    </g>
  );
}

const wire = { stroke: WIRE, strokeWidth: 1.5, fill: "none" } as const;

/* -------------------------------------------------------------------------- */

export function AlphaFoldDiagram() {
  return (
    <svg viewBox="0 0 756 240" className="h-auto w-full font-mono" role="img" aria-label="AlphaFold ensemble pipeline: sequence, MSA search, column masking and dropout in parallel, AlphaFold2 run 100 times, DBSCAN clustering">
      <g {...wire}>
        <line x1="120" y1="120" x2="160" y2="120" />
        <path d="M280 120 C 300 120, 300 55, 320 55" />
        <path d="M280 120 C 300 120, 300 185, 320 185" />
        <path d="M460 55 C 480 55, 480 120, 500 120" />
        <path d="M460 185 C 480 185, 480 120, 500 120" />
        <line x1="610" y1="120" x2="646" y2="120" />
      </g>
      <Node x={0} y={85} title="sequence" sub="FASTA" />
      <Node x={160} y={85} title="MSA search" sub="ColabFold" />
      <Node x={320} y={20} w={140} title="column mask" sub="seed i" tone="accent" />
      <Node x={320} y={150} w={140} title="dropout on" sub="seed i" tone="accent" />
      <Node x={500} y={85} w={110} title="AlphaFold2" sub="i = 1…100" />
      <Node x={646} y={85} w={110} title="DBSCAN" sub="→ ensemble" tone="output" />
    </svg>
  );
}

export function AgentsDiagram() {
  return (
    <svg viewBox="0 0 756 260" className="h-auto w-full font-mono" role="img" aria-label="Agent architecture: mobile app to guard agent, routing to order, FAQ and recommendation agents, backed by Pinecone and Firebase">
      <g {...wire}>
        <line x1="110" y1="130" x2="150" y2="130" />
        <path d="M270 130 C 290 130, 290 40, 310 40" />
        <path d="M270 130 C 290 130, 290 130, 310 130" />
        <path d="M270 130 C 290 130, 290 220, 310 220" />
        <path d="M450 40 C 480 40, 480 130, 510 130" />
        <path d="M450 130 L 510 130" />
        <path d="M450 220 C 480 220, 480 130, 510 130" />
      </g>
      <Node x={0} y={95} w={110} title="React Native" sub="chat UI" />
      <Node x={150} y={95} w={120} title="guard agent" sub="on/off topic" tone="accent" />
      <Node x={310} y={10} w={140} title="order agent" sub="structured state" />
      <Node x={310} y={95} w={140} title="FAQ agent" sub="RAG" />
      <Node x={310} y={185} w={140} title="recommender" sub="market basket" />
      <Node x={510} y={95} w={110} title="Llama" sub="RunPod GPU" tone="output" />
      <Node x={646} y={10} w={110} h={70} title="Pinecone" sub="vectors" />
      <Node x={646} y={150} w={110} h={70} title="Firebase" sub="orders · menu" />
      <g {...wire}>
        <path d="M620 110 C 635 100, 635 60, 646 50" />
        <path d="M620 150 C 635 160, 635 180, 646 190" />
      </g>
    </svg>
  );
}

export function VisionDiagram() {
  return (
    <svg viewBox="0 0 756 200" className="h-auto w-full font-mono" role="img" aria-label="Vision pipeline: broadcast frame, YOLOv8 detection, K-Means team assignment and optical flow, perspective transform, metrics">
      <g {...wire}>
        <line x1="110" y1="100" x2="150" y2="100" />
        <path d="M270 100 C 290 100, 290 40, 310 40" />
        <path d="M270 100 C 290 100, 290 160, 310 160" />
        <path d="M450 40 C 470 40, 470 100, 490 100" />
        <path d="M450 160 C 470 160, 470 100, 490 100" />
        <line x1="610" y1="100" x2="646" y2="100" />
      </g>
      <Node x={0} y={65} w={110} title="frame" sub="broadcast" />
      <Node x={150} y={65} w={120} title="YOLOv8" sub="detect + track" tone="accent" />
      <Node x={310} y={10} w={140} title="K-Means" sub="team by kit" />
      <Node x={310} y={130} w={140} title="optical flow" sub="camera motion" />
      <Node x={490} y={65} w={120} title="homography" sub="pixels → pitch" />
      <Node x={646} y={65} w={110} title="metrics" sub="speed · distance" tone="output" />
    </svg>
  );
}

export function CarbonDiagram() {
  return (
    <svg viewBox="0 0 756 200" className="h-auto w-full font-mono" role="img" aria-label="Carbon platform: React frontend, Spring Boot backend, Flask ML API on GCP, emission models">
      <g {...wire}>
        <line x1="130" y1="100" x2="180" y2="100" />
        <line x1="300" y1="100" x2="350" y2="100" />
        <line x1="470" y1="100" x2="520" y2="100" />
      </g>
      <Node x={10} y={65} title="React" sub="dashboard" />
      <Node x={180} y={65} title="Spring Boot" sub="app backend" />
      <Node x={350} y={65} title="Flask API" sub="REST" tone="accent" />
      <Node x={520} y={65} w={140} title="emission models" sub="CO₂e per stage" tone="output" />
      <rect x={340} y={40} width={330} height={120} rx={10} fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 5" />
      <text x={505} y={30} textAnchor="middle" fill="#8B95A9" fontSize={11}>
        Google Cloud Platform
      </text>
    </svg>
  );
}

/** Picks the right diagram for a project. Returns null if it has none. */
export function ProjectDiagram({ kind }: { kind?: string }) {
  switch (kind) {
    case "alphafold":
      return <AlphaFoldDiagram />;
    case "agents":
      return <AgentsDiagram />;
    case "vision":
      return <VisionDiagram />;
    case "carbon":
      return <CarbonDiagram />;
    default:
      return null;
  }
}
