"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { Goo } from "@/components/site/ui/goo";
import { Signature } from "@/components/site/ui/signature";
import { CONTACT, TAGLINE_WORDS } from "@/lib/content";
import s from "./banner.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * The big generative panel (after Prism's hero art) carrying the brand's
 * tagline (brandbook p. 13). A goo composition fills a wide rounded panel and
 * resamples on a slow beat and on click; a white rule grid of square cells sits
 * over it, and the ring of cells round its edge frames a sheet of bright paper
 * set like the brandbook page: "Creative Worth" in CommonWealth with the twelve
 * tagline words orbiting it, some turned, and the page's dotted header line.
 * A few ring cells are lit yellow (multiplied into the colour below, and
 * reshuffled every time the composition changes). Four corner meta blocks
 * (Prism's hero metas) carry real facts around the panel.
 */

type Dims = { cols: number; rows: number; gc: number; gr: number };

// What the server renders: the desktop panel (~1330 x 665).
const DESKTOP: Dims = { cols: 16, rows: 8, gc: 12, gr: 6 };

/**
 * The goo blur is in pixels, so the composition keeps ~85px cells at any size.
 * The rule grid keeps square cells: 12 x 6 on the 2:1 desktop panel, 9 x 6 on
 * the 3:2 tablet one, 8 x 10 on the 4:5 phone one.
 */
function measure(w: number, h: number): Dims {
  const cell = 85;
  const ratio = w / h;
  const [gc, gr] = ratio > 1.7 ? [12, 6] : ratio > 1.1 ? [9, 6] : [8, 10];
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

/** About one cell in four of the ring round the paper (the rest is under it). */
function pickLit(gc: number, gr: number, rand: () => number) {
  const ring: number[] = [];
  for (let r = 0; r < gr; r++) {
    for (let c = 0; c < gc; c++) {
      if (r === 0 || r === gr - 1 || c === 0 || c === gc - 1) ring.push(r * gc + c);
    }
  }
  for (let i = ring.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ring[i], ring[j]] = [ring[j], ring[i]];
  }
  return new Set(ring.slice(0, Math.round(ring.length / 4)));
}

/*
 * Where each tagline word sits, as on brandbook p. 13: the centre as a fraction
 * of the lockup's width and height, and its turn. `w` is the wide lockup
 * (desktop, tablet), `t` the tall one (phones), which stacks the words above,
 * between and under the two lines.
 */
type Spot = [x: number, y: number, r: number];
const ORBIT: Record<string, { w: Spot; t: Spot }> = {
  Historia: { w: [0.321, 0.102, 0], t: [0.25, 0.08, 0] },
  Relevancia: { w: [0.773, 0.102, 0], t: [0.73, 0.062, -4] },
  Visión: { w: [0.183, 0.214, 0], t: [0.15, 0.205, -8] },
  Creación: { w: [0.056, 0.484, 0], t: [0.64, 0.2, 3] },
  Ideas: { w: [0.338, 0.515, 66], t: [0.07, 0.6, 66] },
  Impacto: { w: [0.46, 0.548, 0], t: [0.5, 0.478, 0] },
  Dirección: { w: [0.59, 0.5, 20], t: [0.82, 0.468, 14] },
  Estrategia: { w: [0.818, 0.528, -12], t: [0.19, 0.474, -9] },
  Valor: { w: [0.966, 0.484, 0], t: [0.935, 0.585, -66] },
  Cultura: { w: [0.888, 0.678, -40], t: [0.76, 0.77, -22] },
  Construir: { w: [0.598, 0.94, 11], t: [0.47, 0.85, 9] },
  Concepto: { w: [0.357, 0.946, 0], t: [0.22, 0.94, 0] },
};

/** A word the lockup doesn't know yet still gets a place on an ellipse. */
const spotFor = (word: string, i: number, n: number) => {
  const known = ORBIT[word];
  if (known) return known;
  const a = (i / n) * Math.PI * 2;
  const p: Spot = [0.5 + 0.46 * Math.cos(a), 0.5 + 0.44 * Math.sin(a), 0];
  return { w: p, t: p };
};

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
    // A block that holds a link never fades: only its label does (see the
    // entrance below), so the link is never focusable while invisible.
    <div className={`${s.meta} ${align === "end" ? s.metaEnd : ""}`} data-meta={m.href ? "link" : ""}>
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

  const { contextSafe } = useGSAP(
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

      // Corner metas and the caption fade up as each one reaches the fold. A
      // meta that holds a link rises in place and fades only its label.
      gsap.utils.toArray<HTMLElement>("[data-meta], [data-cap]", root).forEach((el, i) => {
        const st = { trigger: el, start: "top 94%" };
        const delay = (i % 2) * 0.1;
        if (el.dataset.meta === "link") {
          gsap.fromTo(el, { y: 18 }, { y: 0, duration: 0.7, ease: "power3.out", delay, scrollTrigger: st });
          gsap.fromTo(el.querySelector("dt"), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out", delay, scrollTrigger: st });
          return;
        }
        gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay, scrollTrigger: st });
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

      // The tagline rises out of its lines, then the full stop lands.
      const h = root.querySelector<HTMLElement>(`.${s.tagline}`)!;
      SplitText.create(h, {
        type: "lines,words,chars",
        mask: "lines",
        linesClass: "bn-line",
        autoSplit: true,
        onSplit(self) {
          // Looked up per split: a re-split rebuilds the heading's markup.
          const stop = h.querySelector(".stop");
          gsap.set(h, { visibility: "visible" });
          const tl = gsap.timeline({ scrollTrigger: { trigger: art, start: "top 58%" } });
          tl.from(self.chars, { yPercent: 118, duration: 1.05, ease: "expo.out", stagger: 0.035 });
          if (stop) tl.from(stop, { scale: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.55");
          return tl;
        },
      });

      // The twelve words drop into orbit round it, in no particular order.
      // (The inner spans move, so each word's own place and turn stay put.)
      gsap.fromTo(
        root.querySelectorAll(`.${s.orbit} > li > span`),
        { opacity: 0, scale: 0.4, rotation: () => gsap.utils.random(-30, 30) },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: { amount: 0.9, from: "random" },
          delay: 0.75,
          clearProps: "transform",
          scrollTrigger: { trigger: art, start: "top 58%", once: true },
        },
      );
    },
    { scope: ref },
  );

  // A remix by hand knocks the words about a little (never on the timed beat).
  const nudge = contextSafe(() => {
    if (!motionOn() || document.documentElement.classList.contains("is-paused")) return;
    const words = ref.current?.querySelectorAll<HTMLElement>(`.${s.orbit} > li > span`);
    if (!words?.length || getComputedStyle(words[0]).opacity === "0") return;
    gsap.fromTo(
      words,
      { rotation: () => gsap.utils.random(-16, 16), scale: 0.88 },
      {
        rotation: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.45)",
        stagger: { amount: 0.25, from: "random" },
        overwrite: "auto",
        clearProps: "transform",
      },
    );
  });

  const tag = `N.º ${String(mix).padStart(3, "0")} · ${dims.cols}×${dims.rows}`;
  const gridVars = { "--gc": dims.gc, "--gr": dims.gr } as React.CSSProperties;

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

          <div ref={artRef} className={s.art} onClick={nudge}>
            <Goo
              cols={dims.cols}
              rows={dims.rows}
              seed={105}
              beat={7000}
              remixLabel="Generar otra composición"
              className={s.remix}
            />
            <div className={s.grid} style={gridVars} aria-hidden="true">
              {Array.from({ length: dims.gc * dims.gr }, (_, i) => (
                <span key={i} className={`${s.cell}${lit.has(i) ? ` ${s.lit}` : ""}`}>
                  <i className={s.ln} />
                  <i className={s.fill} />
                </span>
              ))}
            </div>

            {/* The paper the ring of goo frames: the tagline page (p. 13). */}
            <div className={s.plateGrid} style={gridVars}>
              <div className={s.plate}>
                <div className={s.plateHead} aria-hidden="true">
                  <Signature items={["The LAB MX", "Saltillo, Coah.", "México"]} className={s.plateSig} />
                </div>
                <div className={s.lockup}>
                  <h2 id="creative-worth" className={s.tagline} lang="en">
                    Creative <br />
                    Worth
                  </h2>
                  <ul className={s.orbit} aria-label="Las palabras que la rodean">
                    {TAGLINE_WORDS.map((word, i) => {
                      const { w, t } = spotFor(word, i, TAGLINE_WORDS.length);
                      const style = {
                        "--x": w[0],
                        "--y": w[1],
                        "--r": `${w[2]}deg`,
                        "--tx": t[0],
                        "--ty": t[1],
                        "--tr": `${t[2]}deg`,
                      } as React.CSSProperties;
                      return (
                        <li key={word} style={style}>
                          <span>{word}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

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
