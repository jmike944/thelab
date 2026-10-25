"use client";

import { useCallback, useEffect, useRef } from "react";

/*
 * Generative "goo" compositions (after the Prism demo). A grid of cells, each
 * holding one shape sized 100% or 200% (the oversize bleeds into neighbours),
 * a quarter-turn rotation, no radius or a huge one, and one of six shape
 * variants, coloured from The Lab's spectrum. Every shape is hard-light, and
 * the grid runs through an SVG gooey filter (blur, then an alpha matrix that
 * crushes the ramp back to a hard edge), so neighbouring shapes melt together.
 *
 * The blur is in pixels, so the cell count must grow with the element: about
 * 6x6 per 500px. Pass cols/rows to match the host's size.
 */

// Weighted: mostly blues and violets, magenta as the hot note, one warm accent.
const PALETTE = [
  "#3537ff",
  "#3537ff",
  "#1e20b8",
  "#8a00ff",
  "#b06bff",
  "#00cfff",
  "#ff0074",
  "#ff0074",
  "#ff9000",
  "#feff1f",
];
const SHAPES = ["", "s1", "s2", "s3", "s4", "s5"];

type Rand = () => number;

/** Small seeded PRNG so the first composition renders the same on server and client. */
function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { c1: string; c2: string; size: number; angle: number; radius: number; shape: string };

function sample(count: number, rand: Rand) {
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const cells: Cell[] = [];
  for (let i = 0; i < count; i++) {
    cells.push({
      c1: pick(PALETTE),
      c2: pick(PALETTE),
      size: (Math.floor(rand() * 2) + 1) * 100,
      angle: Math.floor(rand() * 4) * 90,
      radius: Math.floor(rand() * 2) * 100,
      shape: pick(SHAPES),
    });
  }
  return { background: pick(PALETTE), cells };
}

const cellStyle = (c: Cell) =>
  ({
    "--c1": c.c1,
    "--c2": c.c2,
    "--size": `${c.size}%`,
    "--angle": `${c.angle}deg`,
    "--radius": `${c.radius}vw`,
  }) as React.CSSProperties;

export type GooProps = {
  cols?: number;
  rows?: number;
  /** Seed for the first composition (keeps SSR and hydration in step). */
  seed?: number;
  /** "sm" uses the lighter blur, for small hosts (avatars, tiles, buttons). */
  size?: "lg" | "sm";
  /** Resample every `beat` ms while on screen (never while the page is paused). */
  beat?: number;
  /** Resample when clicked (rendered as a button with this label). */
  remixLabel?: string;
  className?: string;
};

export function Goo({ cols = 6, rows = 6, seed = 1, size = "lg", beat, remixLabel, className }: GooProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const first = sample(cols * rows, mulberry32(seed));

  const resample = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const next = sample(grid.children.length, Math.random);
    grid.style.background = next.background;
    next.cells.forEach((c, i) => {
      const cell = grid.children[i] as HTMLElement;
      Object.entries(cellStyle(c)).forEach(([k, v]) => cell.style.setProperty(k, String(v)));
      (cell.firstChild as HTMLElement).className = `inner ${c.shape}`;
    });
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!beat || !grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(grid);
    // Skips its beat while off screen, in a background tab, or while the reader
    // has paused the page's animations (html.is-paused, see ui/pause.tsx).
    const id = window.setInterval(() => {
      if (onScreen && !document.hidden && !document.documentElement.classList.contains("is-paused")) resample();
    }, beat);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [beat, resample]);

  const grid = (
    <div
      ref={gridRef}
      className={`goo${size === "sm" ? " goo--sm" : ""}${beat ? " goo--slow" : ""}`}
      style={{ "--cols": cols, "--rows": rows, background: first.background } as React.CSSProperties}
      aria-hidden="true"
    >
      {first.cells.map((c, i) => (
        <div key={i} className="cell" style={cellStyle(c)}>
          <div className={`inner ${c.shape}`} />
        </div>
      ))}
    </div>
  );

  if (remixLabel) {
    return (
      <button type="button" className={`goo-host goo-host--btn ${className ?? ""}`} onClick={resample} aria-label={remixLabel}>
        {grid}
      </button>
    );
  }
  return <div className={`goo-host ${className ?? ""}`}>{grid}</div>;
}

/** The two gooey filters every composition runs through. Render once. */
export function GooFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <filter id="goo-sm">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
