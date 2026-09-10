"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   PROTEIN VIEWER

   Renders a real protein structure, in 3D, that the visitor can drag to rotate.
   This is the signature element of the site: it ties the hero directly to your
   AlphaFold research instead of showing a generic abstract graphic.

   How it works:
   1. 3Dmol.js is loaded from a CDN the first time this component mounts.
      (It is ~1MB, so we deliberately do not bundle it — the page renders and
      becomes usable before the viewer arrives.)
   2. The structure is fetched from the RCSB Protein Data Bank by its ID.
   3. Until both of those finish — and if either fails — the SVG fallback
      below is shown instead. The hero never appears broken or empty.

   The two default structures are adenylate kinase, the textbook example of a
   protein with distinct open and closed states — exactly the phenomenon your
   research is about. Swap the IDs for a protein from your own thesis if you
   have one; any four-character PDB ID works.
   ========================================================================== */

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.1.0/3Dmol-min.js";

type Conformation = { id: string; label: string };

const CONFORMATIONS: Conformation[] = [
  { id: "4AKE", label: "open" },
  { id: "1AKE", label: "closed" },
];

// 3Dmol attaches itself to window.$3Dmol. TypeScript needs to be told.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $3Dmol?: any;
  }
}

/** Loads the 3Dmol script once, and resolves on every later call. */
let scriptPromise: Promise<void> | null = null;
function load3Dmol(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.$3Dmol) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CDN;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("3Dmol.js failed to load"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export default function ProteinViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await load3Dmol();
        if (cancelled || !mountRef.current || !window.$3Dmol) return;

        const viewer = window.$3Dmol.createViewer(mountRef.current, {
          backgroundColor: "#0c1220",
          antialias: true,
        });
        viewerRef.current = viewer;

        await renderStructure(viewer, CONFORMATIONS[0].id);
        if (cancelled) return;

        setReady(true);

        // Slow idle rotation, paused whenever the visitor is interacting.
        viewer.spin("y", 0.35);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    init();
    return () => {
      cancelled = true;
      try {
        viewerRef.current?.clear();
      } catch {
        /* viewer may already be gone; nothing to do */
      }
    };
  }, []);

  /** Fetch a PDB file and draw it as a coloured cartoon ribbon. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderStructure(viewer: any, pdbId: string) {
    const res = await fetch(`https://files.rcsb.org/download/${pdbId}.pdb`);
    if (!res.ok) throw new Error(`Could not fetch ${pdbId}`);
    const data = await res.text();

    viewer.clear();
    viewer.addModel(data, "pdb");
    // Cartoon representation, coloured along the chain so the fold reads
    // clearly against the dark background.
    viewer.setStyle({}, { cartoon: { colorscheme: "cyanCarbon", thickness: 0.4 } });
    viewer.addStyle({ hetflag: true }, { stick: { radius: 0.15, color: "#4fe3c1" } });
    viewer.zoomTo();
    viewer.render();
  }

  async function switchTo(index: number) {
    if (!viewerRef.current || index === active) return;
    setActive(index);
    try {
      viewerRef.current.spin(false);
      await renderStructure(viewerRef.current, CONFORMATIONS[index].id);
      viewerRef.current.spin("y", 0.35);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="relative rounded-2xl border border-line bg-gradient-to-b from-panel/90 to-ink/90 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-3 font-mono text-xs">
        <span className="text-dim">3D · conformational ensemble</span>
        <span className={ready ? "text-accent" : "text-faint"}>
          {failed ? "○ static" : ready ? "● live" : "○ loading"}
        </span>
      </div>

      {/* The 3D canvas mounts here. `position: relative` is required by 3Dmol. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <div
          ref={mountRef}
          className="absolute inset-0"
          style={{ position: "relative", width: "100%", height: "100%" }}
          aria-hidden="true"
        />

        {/* Fallback: shown until the 3D viewer is ready, and kept if it fails. */}
        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ProteinFallback />
          </div>
        )}
      </div>

      {/* Footer: conformation toggle */}
      <div className="flex items-center justify-between border-t border-line px-1 pt-3 font-mono text-xs text-dim">
        {ready ? (
          <div className="flex items-center gap-2">
            {CONFORMATIONS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => switchTo(i)}
                className={`rounded px-2 py-1 transition-colors ${
                  i === active
                    ? "bg-accent/15 text-accent"
                    : "text-dim hover:text-body"
                }`}
              >
                {c.id} · {c.label}
              </button>
            ))}
          </div>
        ) : (
          <span>adenylate kinase · open ⇄ closed</span>
        )}
        <span className="hidden sm:inline">{ready ? "drag to rotate" : ""}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The hand-drawn ribbon shown while 3Dmol loads (and if it cannot).
   Pure SVG, no dependencies, so it always renders.
--------------------------------------------------------------------------- */
function ProteinFallback() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" role="img" aria-label="Protein structure">
      <defs>
        <radialGradient id="pv-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4FE3C1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4FE3C1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pv-ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FE3C1" />
          <stop offset="100%" stopColor="#3C7CF0" />
        </linearGradient>
      </defs>
      <circle cx="300" cy="300" r="280" fill="url(#pv-glow)" />
      <g className="spin-slow" fill="none" strokeLinecap="round">
        <path
          d="M120 320 C 160 180, 260 160, 300 250 S 420 360, 470 250 S 400 120, 330 180"
          stroke="url(#pv-ribbon)"
          strokeWidth="14"
          opacity="0.9"
        />
        <path
          d="M140 360 C 200 420, 300 440, 340 360 S 460 300, 480 380 S 380 500, 300 460"
          stroke="#3C7CF0"
          strokeWidth="10"
          opacity="0.55"
        />
        <path
          d="M200 200 C 240 260, 200 340, 260 380 S 360 420, 380 340"
          stroke="#4FE3C1"
          strokeWidth="6"
          opacity="0.5"
        />
        <g fill="#E7EBF3" opacity="0.9">
          <circle cx="300" cy="250" r="5" />
          <circle cx="470" cy="250" r="4" />
          <circle cx="330" cy="180" r="4" />
          <circle cx="340" cy="360" r="4" />
          <circle cx="480" cy="380" r="4" />
          <circle cx="260" cy="380" r="4" />
          <circle cx="120" cy="320" r="4" />
        </g>
      </g>
    </svg>
  );
}
