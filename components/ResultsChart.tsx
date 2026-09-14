/* ============================================================================
   RESULTS CHART — OC23 success rate by method (Table 7.2 of the thesis).
   ========================================================================== */

type Row = {
  method: string;
  rate: number;
  budget: string;
  mine?: boolean;
};

const rows: Row[] = [
  { method: "This pipeline", rate: 78.3, budget: "N = 100", mine: true },
  { method: "AFsample2", rate: 78.3, budget: "N = 1000" },
  { method: "SPEACH_AF", rate: 73.9, budget: "N = 1000" },
  { method: "MSA subsample", rate: 69.6, budget: "N = 1000" },
  { method: "AFsample", rate: 56.5, budget: "N = 1000" },
  { method: "AF-Cluster", rate: 47.8, budget: "N = 1000" },
  { method: "AFvanilla", rate: 47.8, budget: "N = 5" },
];

const LABEL_W = 132;
const TRACK_X = 144;
const TRACK_W = 300;
const ROW_H = 40;
const TOP = 44;

const scale = (pct: number) => (pct / 100) * TRACK_W;
const rowY = (i: number) => TOP + i * ROW_H;

export default function ResultsChart() {
  const height = TOP + rows.length * ROW_H + 16;

  return (
    <svg
      viewBox={`0 0 560 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Horizontal bar chart of OC23 success rates. This pipeline reaches 78.3 percent using 100 models per target, equalling AFsample2 which uses 1000. SPEACH_AF reaches 73.9 percent, MSA subsampling 69.6, AFsample 56.5, AF-Cluster and AFvanilla 47.8."
    >
      <g stroke="rgba(255,255,255,0.08)">
        {[0, 25, 50, 75, 100].map((p) => (
          <line
            key={p}
            x1={TRACK_X + scale(p)} y1={TOP - 14}
            x2={TRACK_X + scale(p)} y2={rowY(rows.length) - 8}
            strokeDasharray={p === 0 ? undefined : "3 5"}
          />
        ))}
      </g>
      <g fontFamily="var(--font-mono)" fontSize="10" fill="#8B95A9">
        {[0, 25, 50, 75, 100].map((p) => (
          <text key={p} x={TRACK_X + scale(p)} y={TOP - 22} textAnchor="middle">
            {p}%
          </text>
        ))}
      </g>

      {rows.map((r, i) => {
        const y = rowY(i);
        const w = scale(r.rate);
        return (
          <g key={r.method}>
            <text
              x={LABEL_W} y={y + 15} textAnchor="end"
              fontFamily="var(--font-sans)" fontSize="12"
              fill={r.mine ? "#E7EBF3" : "#B8C0D0"}
              fontWeight={r.mine ? 600 : 400}
            >
              {r.method}
            </text>
            <rect
              x={TRACK_X} y={y} width={w} height={20} rx={3}
              fill={r.mine ? "rgba(79,227,193,0.35)" : "rgba(60,124,240,0.28)"}
              stroke={r.mine ? "#4FE3C1" : "#3C7CF0"}
              strokeWidth="1.5"
            />
            <text
              x={TRACK_X + w + 10} y={y + 15}
              fontFamily="var(--font-mono)" fontSize="11"
              fill={r.mine ? "#E7EBF3" : "#B8C0D0"}
            >
              {r.rate}%
            </text>
            <text
              x={TRACK_X + w + 52} y={y + 15}
              fontFamily="var(--font-mono)" fontSize="10"
              fill={r.mine ? "#4FE3C1" : "#5C6577"}
            >
              {r.budget}
            </text>
          </g>
        );
      })}
    </svg>
  );
}