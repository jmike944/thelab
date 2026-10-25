"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { Goo } from "@/components/site/ui/goo";
import { CONTACT } from "@/lib/content";
import s from "./banner.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * The big generative panel (after Prism's hero art). A goo composition fills a
 * wide rounded panel and resamples on a slow beat and on click; a white rule
 * grid sits over it with a few cells lit yellow (multiplied into the colour
 * below, and reshuffled every time the composition changes); the studio's line
 * "Creative worth." is set huge in the bottom-left over a soft ink shade. Four
 * corner meta blocks (Prism's hero metas) carry real facts around the panel.
 */

type Dims = { cols: number; rows: number; gc: number; gr: number };

// What the server renders: the desktop panel (~1360 x 580).
const DESKTOP: Dims = { cols: 16, rows: 7, gc: 12, gr: 6 };

/** The goo blur is in pixels, so the composition keeps ~85px cells at any size. */
function measure(w: number, h: number): Dims {
  const cell = 85;
  const ratio = w / h;
  const [gc, gr] = ratio > 1.9 ? [12, 6] : ratio > 1.2 ? [9, 6] : [6, 8];
  return {
    cols: Math.max(4, Math.round(w / cell)),
    rows: Math.max(3, Math.round(h / cell)),
    gc,
    gr,
  };
}

/** Seeded PRNG so the first set of lit cells matches on server and client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** About one cell in seven, at most one per column, so they scatter. */
function pickLit(gc: number, gr: number, rand: () => number) {
  const n = Math.round((gc * gr) / 7);
  const cols = Array.from({ length: gc }, (_, i) => i);
  for (let i = cols.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cols[i], cols[j]] = [cols[j], cols[i]];
  }
  const lit = new Set<number>();
  cols.slice(0, n).forEach((c) => lit.add(Math.floor(rand() * gr) * gc + c));
  while (lit.size < n) lit.add(Math.floor(rand() * gc * gr));
  return lit;
}

const METAS_TOP = [
  { n: "01", k: "Especialidad", v: "Restaurantes y experiencias" },
  { n: "02", k: "Crecimiento", v: "100% orgánico" },
];
const METAS_BOTTOM = [
  { n: "03", k: "Instagram", v: CONTACT.instagram, href: CONTACT.instagramUrl },
  { n: "04", k: "Respuesta", v: CONTACT.response },
];

type Meta = { n: string; k: string; v: string; href?: string };

function MetaBlock({ m, align }: { m: Meta; align: "start" | "end" }) {
  return (
    <div className={`${s.meta} ${align === "end" ? s.metaEnd : ""}`} data-meta>
      <dt className={`mono ${s.metaK}`}>
        <span className={s.metaN}>{m.n}</span>
        {m.k}
      </dt>
      <dd className={s.metaV}>
        {m.href ? (
          <a className="link" href={m.href} target="_blank" rel="noopener noreferrer">
            {m.v}
            <span className="sr-only"> (abre Instagram en otra pestaña)</span>
          </a>
        ) : (
          m.v
        )}
      </dd>
    </div>
  );
}

export function Banner() {
  const ref = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<Dims>(DESKTOP);
  const [lit, setLit] = useState(() => pickLit(DESKTOP.gc, DESKTOP.gr, mulberry32(7)));
  const [mix, setMix] = useState(1);
  const dimsRef = useRef(dims);
  const moRef = useRef<MutationObserver | null>(null);

  // Size the composition and the rule grid to the panel.
  useLayoutEffect(() => {
    const art = artRef.current;
    if (!art) return;
    const apply = () => {
      const next = measure(art.clientWidth, art.clientHeight);
      const cur = dimsRef.current;
      if (next.cols === cur.cols && next.rows === cur.rows && next.gc === cur.gc && next.gr === cur.gr) return;
      if (next.gc !== cur.gc || next.gr !== cur.gr) setLit(pickLit(next.gc, next.gr, mulberry32(7)));
      dimsRef.current = next;
      setDims(next);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(art);
    return () => ro.disconnect();
  }, []);

  // A re-render for a new size rewrites the grid's styles: that isn't a remix.
  useLayoutEffect(() => {
    moRef.current?.takeRecords();
  }, [dims]);

  // Every time the composition resamples (beat or click), count it and
  // reshuffle the lit cells so the grid answers the new colours.
  useEffect(() => {
    const grid = artRef.current?.querySelector(".goo");
    if (!grid) return;
    const mo = new MutationObserver(() => {
      const { gc, gr } = dimsRef.current;
      setMix((m) => m + 1);
      setLit(pickLit(gc, gr, Math.random));
    });
    mo.observe(grid, { attributes: true, attributeFilter: ["style"], subtree: true });
    moRef.current = mo;
    return () => {
      mo.disconnect();
      moRef.current = null;
    };
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!motionOn()) return;
      const root = ref.current!;
      const art = artRef.current!;
      const safe = contextSafe!;

      // The panel settles to full size as it scrolls up into view.
      gsap.fromTo(
        art,
        { scale: 0.94, y: 40 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: art, start: "top bottom", end: "top 45%", scrub: true },
        },
      );

      // Corner metas and the caption fade up as each one reaches the fold.
      gsap.utils.toArray<HTMLElement>("[data-meta], [data-cap]", root).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: (i % 2) * 0.1,
            scrollTrigger: { trigger: el, start: "top 94%" },
          },
        );
      });

      // The hand note and the tilted tag stamp on.
      gsap.fromTo(
        root.querySelectorAll("[data-pop]"),
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(2.4)",
          stagger: 0.18,
          delay: 0.5,
          scrollTrigger: { trigger: art, start: "top 70%" },
        },
      );

      // The rule grid draws in at random, then the lit cells switch on.
      ScrollTrigger.create({
        trigger: art,
        start: "top 72%",
        once: true,
        onEnter: safe(() => {
          const lines = art.querySelectorAll(`.${s.ln}`);
          const fills = art.querySelectorAll(`.${s.lit} .${s.fill}`);
          art.dataset.in = "1";
          gsap
            .timeline()
            .fromTo(
              lines,
              { opacity: 0 },
              { opacity: 1, duration: 0.8, ease: "power2.out", stagger: { amount: 0.7, from: "random" }, clearProps: "opacity" },
            )
            .fromTo(
              fills,
              { scale: 0 },
              { scale: 1, duration: 0.55, ease: "back.out(2)", stagger: { amount: 0.8, from: "random" }, clearProps: "transform" },
              0.45,
            );
        }),
      });

      // The statement rises out of its lines, then the full stop lands.
      const h = root.querySelector<HTMLElement>(`.${s.statement}`)!;
      const stop = h.querySelector(".stop");
      SplitText.create(h, {
        type: "lines,words,chars",
        mask: "lines",
        linesClass: "bn-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(h, { visibility: "visible" });
          const tl = gsap.timeline({ scrollTrigger: { trigger: art, start: "top 58%" } });
          tl.from(self.chars, { yPercent: 118, duration: 1.05, ease: "expo.out", stagger: 0.035 });
          if (stop) tl.from(stop, { scale: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.55");
          return tl;
        },
      });
    },
    { scope: ref },
  );

  const tag = `N.º ${String(mix).padStart(3, "0")} · ${dims.cols}×${dims.rows}`;

  return (
    <section ref={ref} className={s.banner} aria-labelledby="creative-worth">
      <div className={s.stage}>
        <dl className={`${s.metas} ${s.metasTop}`}>
          <MetaBlock m={METAS_TOP[0]} align="start" />
          <MetaBlock m={METAS_TOP[1]} align="end" />
        </dl>

        <div className={s.frame}>
          <p className={s.noteWrap} aria-hidden="true" data-pop>
            <span className="note">toca o da clic para remezclar ↘</span>
          </p>
          <p className={s.tiltWrap} aria-hidden="true" data-pop>
            <span className="tilt">Desde {CONTACT.city}</span>
          </p>

          <div ref={artRef} className={s.art}>
            <Goo
              cols={dims.cols}
              rows={dims.rows}
              seed={105}
              beat={7000}
              remixLabel="Generar otra composición"
              className={s.remix}
            />
            <div
              className={s.grid}
              style={{ "--gc": dims.gc, "--gr": dims.gr } as React.CSSProperties}
              aria-hidden="true"
            >
              {Array.from({ length: dims.gc * dims.gr }, (_, i) => (
                <span key={i} className={`${s.cell}${lit.has(i) ? ` ${s.lit}` : ""}`}>
                  <i className={s.ln} />
                  <i className={s.fill} />
                </span>
              ))}
            </div>
            <div className={s.shade} aria-hidden="true" />
            <h2 id="creative-worth" className={s.statement} lang="en">
              Creative <br />
              worth<span className="stop" aria-hidden="true" />
            </h2>
            <p className={`mono ${s.tag}`} aria-hidden="true">
              {tag}
            </p>
          </div>
        </div>

        <div className={s.foot}>
          <p className={`mono ${s.caption}`} data-cap>
            Composición generativa, hecha en tu navegador
          </p>
          <dl className={`${s.metas} ${s.metasBottom}`}>
            <MetaBlock m={METAS_BOTTOM[0]} align="start" />
            <MetaBlock m={METAS_BOTTOM[1]} align="end" />
          </dl>
        </div>
      </div>
    </section>
  );
}
