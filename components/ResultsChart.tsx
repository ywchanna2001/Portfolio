/* ============================================================================
   RESULTS CHART — the bar chart on the AlphaFold case study.

   Plain SVG, drawn to a proper 0–100% scale (the y positions are computed, not
   eyeballed, so the bars cannot lie). The two baseline bars are deliberately
   marked as placeholders until you fill in the real figures from your thesis.

   To use real numbers: replace the `bars` array below.
   ========================================================================== */

type Bar = {
  /** Bar label under the axis. */
  x: string;
  /** Success rate, 0–100. Use null for a placeholder bar. */
  value: number | null;
  /** Label drawn above the bar. */
  label: string;
  kind: "mine" | "baseline";
};

const bars: Bar[] = [
  { x: "100 models", value: 78.3, label: "78.3%", kind: "mine" },
  { x: "[N]", value: 71.4, label: "[baseline]", kind: "baseline" },
  { x: "[N] models", value: 75.2, label: "[baseline]", kind: "baseline" },
];

// Plot geometry
const TOP = 40; // y for 100%
const BOTTOM = 250; // y for 0%
const scale = (pct: number) => BOTTOM - (pct / 100) * (BOTTOM - TOP);

const COL_X = [118, 300, 450]; // left edge of each bar
const BAR_W = 44;

export default function ResultsChart() {
  return (
    <svg viewBox="0 0 560 300" className="h-auto w-full" role="img" aria-label="Bar chart: this pipeline reaches 78.3% success on OC23 using 100 models per target, compared with sampling baselines">
      {/* Axes and gridlines */}
      <g stroke="rgba(255,255,255,0.08)">
        <line x1="60" y1={TOP} x2="60" y2={BOTTOM} />
        <line x1="60" y1={BOTTOM} x2="540" y2={BOTTOM} />
        {[25, 50, 75].map((p) => (
          <line key={p} x1="60" y1={scale(p)} x2="540" y2={scale(p)} strokeDasharray="3 5" />
        ))}
      </g>

      {/* Axis labels */}
      <g fontFamily="var(--font-mono)" fontSize="11" fill="#8B95A9">
        {[0, 25, 50, 75, 100].map((p) => (
          <text key={p} x="50" y={scale(p) + 4} textAnchor="end">
            {p}%
          </text>
        ))}
        {bars.map((b, i) => (
          <text key={b.x} x={COL_X[i] + BAR_W / 2} y={BOTTOM + 22} textAnchor="middle">
            {b.x}
          </text>
        ))}
      </g>

      {/* Bars */}
      {bars.map((b, i) => {
        if (b.value === null) return null;
        const y = scale(b.value);
        const mine = b.kind === "mine";
        return (
          <g key={b.x}>
            <rect
              x={COL_X[i]}
              y={y}
              width={BAR_W}
              height={BOTTOM - y}
              rx={3}
              fill={mine ? "rgba(79,227,193,0.35)" : "rgba(60,124,240,0.35)"}
              stroke={mine ? "#4FE3C1" : "#3C7CF0"}
              strokeWidth="1.5"
            />
            <text
              x={COL_X[i] + BAR_W / 2}
              y={y - 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="12"
              fill={mine ? "#E7EBF3" : "#8B95A9"}
            >
              {b.label}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g fontFamily="var(--font-sans)" fontSize="12">
        <rect x="60" y="14" width="10" height="10" fill="rgba(79,227,193,0.35)" stroke="#4FE3C1" />
        <text x="76" y="23" fill="#B8C0D0">
          this pipeline
        </text>
        <rect x="170" y="14" width="10" height="10" fill="rgba(60,124,240,0.35)" stroke="#3C7CF0" />
        <text x="186" y="23" fill="#B8C0D0">
          sampling baselines
        </text>
      </g>
    </svg>
  );
}
