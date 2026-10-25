"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { Goo } from "@/components/site/ui/goo";
import { CAPABILITIES, SERVICES, STEPS, projectById } from "@/lib/content";
import s from "./services.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const SEEDS = [211, 347, 529, 863];
const BEATS = [5200, 6100, 5600, 6700];
const pad = (n: number) => String(n).padStart(2, "0");

/*
 * What each row adds beyond its description, so the tag, the copy and the
 * points never restate one another. The tag names the real piece of work
 * behind the service (or, for community management, the process step it
 * is); the points list what goes into it, drawn from the portfolio and the
 * studio's own capabilities. A service missing here falls back to its own
 * tag and points from content.ts.
 */
type Row = { k: string; v: string; points: string[] };
const caseOf = (id: string) => ({ k: "Caso", v: projectById(id).client });
const ROWS: Record<string, Row> = {
  "Contenido viral": { ...caseOf("wu"), points: ["Guion", "Storytelling", "Collabs", "Campañas"] },
  "Cobertura de eventos": { ...caseOf("apertura"), points: ["Shorts y reels", "Foto en sitio"] },
  "Foto y video": { ...caseOf("mercato"), points: ["Platillos", "Bebidas", "Retratos"] },
  "Community management": { k: `Paso ${pad(3)}`, v: STEPS[2].title, points: ["Publicación", "Conversación"] },
};

/**
 * Construction drawing of the brand's round forms: one circle per service in
 * a ruled frame. Each circle prints blue once its service has been reached.
 */
function Glyph() {
  const cx = [46, 122, 198, 274];
  return (
    <svg className={s.glyph} viewBox="0 0 320 132" aria-hidden="true">
      <rect className={s.gFrame} x="1" y="1" width="318" height="130" />
      <path className={s.gGuide} d="M1 60H319M1 30H319M1 90H319" />
      {cx.map((x) => (
        <path key={`v${x}`} className={s.gGuide} d={`M${x} 1V131`} />
      ))}
      {cx.map((x, i) => (
        <g key={x} className={s.gDot} data-dot={i}>
          <circle className={s.gFill} cx={x} cy="60" r="30" />
          <circle className={s.gRing} cx={x} cy="60" r="30" />
          <path className={s.gCross} d={`M${x - 6} 60H${x + 6}M${x} 54V66`} />
          <text className={s.gText} x={x} y="117" textAnchor="middle">
            {pad(i + 1)}
          </text>
        </g>
      ))}
      <path className={s.gTick} d="M16 10V20M76 10V20M16 15H76" />
      <text className={s.gText} x="84" y="19">
        Ø 60
      </text>
    </svg>
  );
}

/**
 * Services (after Corvel's contents): a sticky heading column with a
 * construction glyph beside the four services; each row's blue rule draws in
 * and its children rise as it arrives, and its circle fills in the glyph.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!motionOn()) return;
      const root = ref.current;
      if (!root) return;
      let alive = true;
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-rule]"));
      const dots = Array.from(root.querySelectorAll<SVGGElement>("[data-dot]"));

      const revealed = new Set<HTMLElement>();
      const reveal = (row: HTMLElement) => {
        if (revealed.has(row)) return;
        revealed.add(row);
        row.classList.add(s.ruled);
        gsap.fromTo(
          row.querySelectorAll("[data-rise]"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out", clearProps: "transform" }
        );
      };

      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 86%",
          once: true,
          onEnter: () => reveal(row),
          onEnterBack: () => reveal(row),
        });
        // The glyph's circle stays printed from the moment its row passes the
        // reading line until you scroll back above it.
        if (dots[i]) {
          ScrollTrigger.create({
            trigger: row,
            start: "top 62%",
            end: "max",
            toggleClass: { targets: dots[i], className: s.on },
          });
        }
      });

      // Headline lines rise out of a mask once the face has loaded.
      const title = root.querySelector<HTMLElement>("[data-split]");
      if (title) {
        // Created once the face has loaded, but inside this context so a
        // revert un-splits it.
        const split = contextSafe!(() => {
          if (!alive || !title.isConnected) return;
          SplitText.create(title, {
            type: "lines",
            mask: "lines",
            // Names the mask wrappers ("sv-line-mask") so the CSS can give
            // them headroom for accents.
            linesClass: "sv-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                // Far enough below the mask that an accent riding above the
                // line box (the Ó of CÓMO) can't peek out before the rise.
                yPercent: 140,
                duration: 1,
                stagger: 0.09,
                ease: "power4.out",
                scrollTrigger: { trigger: title, start: "top 88%", once: true },
              }),
          });
        });
        document.fonts.ready.then(split);
      }

      // On revert the risen copy returns to its hidden start, so the rules do too.
      return () => {
        alive = false;
        rows.forEach((row) => row.classList.remove(s.ruled));
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="servicios" aria-labelledby="servicios-title" className={`sec ${s.services}`}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.head}>
          <p className="sec-tag mono">Servicios</p>
          <Glyph />
          <h2 id="servicios-title" className="h2" data-split>
            Lo que hacemos
            <span className="stop" aria-hidden="true" />
          </h2>
          <p className={`mono ${s.headNote}`}>
            <span>{pad(SERVICES.length)} servicios</span>
            <span>{pad(CAPABILITIES.length)} capacidades</span>
            <span>Del guion a la conversación</span>
          </p>
          <p className={`note ${s.hand}`}>
            todo 100% orgánico
            <svg viewBox="0 0 70 46" className={s.arrow} aria-hidden="true">
              <path d="M4 8 C 26 2, 54 10, 62 38" />
              <path d="M52 32 L 62 40 L 67 28" />
            </svg>
          </p>
        </div>

        <ol className={s.list}>
          {SERVICES.map((svc, i) => {
            const row = ROWS[svc.name];
            const points = row?.points ?? svc.points;
            return (
              <li key={svc.name} className={s.svc} data-rule>
                <div className={s.tileWrap} data-rise aria-hidden="true">
                  <Goo size="sm" cols={3} rows={3} seed={SEEDS[i]} beat={BEATS[i]} className={s.tile} />
                  <span className={`mono ${s.num}`}>{pad(i + 1)}</span>
                </div>
                <h3 className={s.name} data-rise>
                  {svc.name}
                </h3>
                <p className={`mono ${s.tag}`} data-rise>
                  {row ? (
                    <>
                      <span className={s.tagK}>{row.k}</span> {row.v}
                    </>
                  ) : (
                    svc.tag
                  )}
                </p>
                <p className={s.desc} data-rise>
                  {svc.description}
                </p>
                <ul className={`mono ${s.points}`} data-rise>
                  {points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
