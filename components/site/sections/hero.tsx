"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { Btn } from "@/components/site/ui/btn";
import { Halftone } from "@/components/site/ui/halftone";
import { CONTACT, PROJECTS, STATS, projectById } from "@/lib/content";
import s from "./hero.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const wu = projectById("wu");
const zoco = projectById("zoco");
const mercato = projectById("mercato");
const rancho = projectById("rancho");
const collab = projectById("collab");
/* Plate numbers follow the PROJECTS order (WU is plate 01), as in the work track. */
const plateNo = (id: string) => String(PROJECTS.findIndex((p) => p.id === id) + 1).padStart(2, "0");
const [zocoFirst, ...zocoRest] = zoco.client.split(" ");

const TOC: [href: string, title: string, key: string][] = [
  ["#trabajo", "Seis proyectos recientes", "Trabajo"],
  ["#proceso", "Se siente, se entiende y se queda", "Proceso"],
  ["#contacto", "Te respondemos en menos de 2 días hábiles", "Contacto"],
];

/*
 * Long thin rays from the arch across the page (Corvel's .cover-lines). The
 * SVG is five arch-widths square with the arch centre at its middle, so one
 * unit is one pixel when the arch is 600px wide. A few short rays end in a
 * blue dot, but only the near-horizontal ones: the steeper rays end inside
 * the masthead or the side columns, where a dot reads as a speck on the logo
 * or a stray full stop. Rounded so server and client render identical numbers.
 */
type Ray = { x1: number; y1: number; x2: number; y2: number; dash: boolean; dot: [number, number] | null };
const r1 = (v: number) => Math.round(v * 10) / 10;
const RAYS: Ray[] = Array.from({ length: 24 }, (_, i) => {
  const deg = -188 + (i / 23) * 196 + Math.sin(i * 2.1) * 3.5;
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const n = Math.sin(a);
  const from = 322 + ((i * 37) % 26);
  const short = i % 6 === 3;
  const to = short ? from + 120 + ((i * 53) % 160) : 1500;
  return {
    x1: r1(c * from),
    y1: r1(n * from),
    x2: r1(c * to),
    y2: r1(n * to),
    dash: !short && i % 3 === 1,
    dot: short && (deg > -30 || deg < -172) ? [r1(c * (to + 9)), r1(n * (to + 9))] : null,
  };
});

/* The Lab lockup ("The LaB"), from /public/logos/the-lab-complete.svg. */
const LOCKUP =
  "M7428.69,1915c0,349.65-263.58,532.54-527.16,532.54s-511.02-177.51-511.02-532.54,247.44-521.78,500.27-521.78,537.92,182.89,537.92,521.78ZM6901.52,2985.46c833.78,0,1215.7-591.71,1215.7-1145.77,0-591.71-451.85-1215.7-1215.7-1215.7h-1108.12v521.78h973.64c-731.57,69.93-1043.57,484.13-1043.57,903.71,0,451.85,381.92,935.98,1178.05,935.98ZM3711.65,3539.52h1839.69v-661.64h-1113.5V0h-726.19v3539.52ZM8590.59,3539.52h1108.12c570.2,0,909.09-467.99,909.09-946.74,0-317.37-150.62-640.13-489.51-823.02,338.89-145.24,494.89-462.61,494.89-785.36,0-478.75-338.89-984.4-898.33-984.4h-1124.25v661.64h1075.84c236.69-5.38,349.65,177.51,349.65,371.17,0,209.79-129.1,424.96-387.3,424.96h-1038.19v661.64h1038.19c258.2,0,381.92,204.41,381.92,403.44,0,182.89-102.2,355.03-311.99,355.03h-1108.12v661.64ZM2533.61,903.71c-102.2,0-215.17-75.31-215.17-209.79s107.58-215.17,215.17-215.17,204.41,69.93,204.41,215.17-102.2,209.79-204.41,209.79ZM2533.61,1215.7h446.47v-209.79h-392.68c295.86-32.28,419.58-199.03,419.58-365.79,0-182.89-156-381.92-473.37-381.92-338.89,0-494.89,242.06-494.89,462.61,0,242.06,182.89,494.89,494.89,494.89ZM532.54,1172.67h274.34V0H0v225.93h532.54v946.74ZM968.26,1172.67h279.72v-537.92c0-118.34,107.58-177.51,225.93-177.51s252.82,69.93,252.82,193.65v521.78h247.44v-521.78c0-268.96-182.89-392.68-414.2-392.68-112.96,0-328.13,59.17-328.13,220.55V0h-263.58v1172.67Z";

/*
 * The logo's construction drawing from the identity film: a frame, two
 * tangent circles at each side, one touching the top edge and one the bottom,
 * and two vertical guides running past the frame. Blue dots mark tangents.
 * Coordinates follow the film's frame (934 x 362).
 */
function Construction({ side }: { side: "l" | "r" }) {
  const draw = { pathLength: 1, "data-draw": "", vectorEffect: "non-scaling-stroke" } as const;
  return (
    <svg className={`${s.diagram} ${side === "l" ? s.diagramL : s.diagramR}`} viewBox="-30 -96 994 572" aria-hidden="true" data-diagram>
      <g className={s.dLines}>
        <rect x="0" y="0" width="934" height="362" {...draw} />
        <circle cx="33" cy="149" r="33" {...draw} />
        <circle cx="99" cy="149" r="33" {...draw} />
        <circle cx="835" cy="126" r="33" {...draw} />
        <circle cx="901" cy="126" r="33" {...draw} />
        <circle cx="702" cy="33" r="33" {...draw} />
        <circle cx="475" cy="329" r="33" {...draw} />
        <line x1="468" y1="-80" x2="468" y2="462" {...draw} />
        <line x1="560" y1="-80" x2="560" y2="462" {...draw} />
        {side === "l" ? (
          <path d={LOCKUP} transform="translate(132 67) scale(0.0633)" {...draw} />
        ) : (
          <>
            <line x1="0" y1="0" x2="934" y2="362" className={s.dDash} vectorEffect="non-scaling-stroke" data-fade />
            <line x1="934" y1="0" x2="0" y2="362" className={s.dDash} vectorEffect="non-scaling-stroke" data-fade />
            <circle cx="467" cy="181" r="118" className={s.dDash} vectorEffect="non-scaling-stroke" data-fade />
            <path d="M0 -44H934M0 -60v32M934 -60v32" {...draw} />
          </>
        )}
      </g>
      <g className={s.dDots}>
        <circle cx="0" cy="149" r="11" data-dot />
        <circle cx="66" cy="149" r="11" data-dot />
        <circle cx="868" cy="126" r="11" data-dot />
        <circle cx="702" cy="0" r="11" data-dot />
        <circle cx="475" cy="362" r="11" data-dot />
        <circle cx={side === "l" ? 468 : 560} cy="-80" r="8" data-dot />
      </g>
    </svg>
  );
}

const Chevron = () => (
  <svg viewBox="0 0 10 16" aria-hidden="true">
    <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/*
 * The page index and the big figure. Rendered twice: inside the pinned stage
 * on wide screens, so they pin and leave with the cover, and below the stage
 * on narrow ones. The CSS shows one copy and sets the other to display:none,
 * so only one is ever in the accessibility tree and the tab order.
 */
function Side({ stage = false }: { stage?: boolean }) {
  const hook = stage ? { "data-side": "" } : {};
  const cls = stage ? ` ${s.inStage}` : "";
  return (
    <>
      <nav className={`${s.toc}${cls}`} aria-label="En esta página" {...hook}>
        <ul>
          {TOC.map(([href, title, key]) => (
            <li key={href} data-up>
              <a href={href}>
                <span className={s.tocT}>{title}</span>
                <Chevron />
                <small className="mono">{key}</small>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`${s.no}${cls}`} {...hook}>
        <p data-up>
          <b>{STATS[0].value}</b>
          <span>visualizaciones, 100% orgánicas</span>
        </p>
        <p className={`${s.count} note`} data-note>
          ¡y contando!
        </p>
      </div>
    </>
  );
}

/**
 * The cover (after Corvel's): a giant LAB masthead between two logo
 * construction drawings, a sunburst arch with rays across the page, the WU
 * video printed through a halftone on a tilted print, and four full-colour
 * plates floating around it. Under motion the section is ~2.2 screens tall:
 * the stage pins while the masthead letters and the plates fly apart, the
 * rays turn and the arch grows. Without motion it's a static, normal cover.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const root = ref.current;
      if (!root || !motionOn() || !contextSafe) return;
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const art = root.querySelector<HTMLElement>("[data-art]");
      const pin = stage?.parentElement;
      if (!stage || !art || !pin) return;

      // Idle loops (rays spin, plates bob) pause while the cover is off screen.
      const io = new IntersectionObserver(([e]) => stage.classList.toggle(s.off, !e.isIntersecting));
      io.observe(stage);

      const q = gsap.utils.selector(root);
      let alive = true;

      const build = contextSafe(() => {
        const mastText = root.querySelector<HTMLElement>("[data-mast-text]");
        const split = mastText ? SplitText.create(mastText, { type: "chars", charsClass: s.ch, aria: "none" }) : null;
        const chars = (split?.chars ?? []) as HTMLElement[];
        if (mastText) gsap.set(mastText, { visibility: "visible" });

        // ---- Page-load entrance: one orchestrated beat.
        const rise = () => (mastText ? mastText.offsetHeight * 0.55 : 60);
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(
            chars,
            { y: rise, rotationX: -80, opacity: 0, transformOrigin: "50% 100%", transformPerspective: 600 },
            { y: 0, rotationX: 0, opacity: 1, duration: 1.15, stagger: 0.07, ease: "power4.out" },
            0
          )
          .fromTo(q("[data-arch-in]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power3.inOut" }, 0.05)
          .fromTo(q("[data-rays]"), { scale: 0.5 }, { scale: 1, duration: 1.8 }, 0.05)
          .fromTo(q("[data-draw]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.035, ease: "power2.inOut" }, 0.2)
          .fromTo(q("[data-ray]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: { each: 0.03, from: "center" }, ease: "power2.out" }, 0.45)
          .fromTo(q("[data-fade]"), { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.03 }, 0.7)
          .fromTo(q("[data-print-in]"), { y: 110, opacity: 0, rotation: 4 }, { y: 0, opacity: 1, rotation: 0, duration: 1.1, ease: "power4.out" }, 0.45)
          .fromTo(q("[data-pop]"), { scale: 0.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75, stagger: 0.075, ease: "back.out(1.7)" }, 0.75)
          .fromTo(q("[data-wipe]"), { clipPath: "inset(0% 100% -20% 0%)" }, { clipPath: "inset(0% 0% -20% 0%)", duration: 0.9, stagger: 0.2, ease: "steps(26)" }, 0.75)
          .fromTo(q("[data-up]"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 }, 0.7)
          .fromTo(q(`.${s.chips} > *`), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 1.05)
          .fromTo(q("[data-dot]"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.05, ease: "back.out(3)" }, 1.35)
          .fromTo(
            q("[data-note]"),
            { clipPath: "inset(-30% 100% -30% -10%)" },
            { clipPath: "inset(-30% -10% -30% -10%)", duration: 0.85, stagger: 0.3, ease: "power2.inOut" },
            1.55
          );

        // ---- Scroll scrub: the cover blows apart while the stage is pinned.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: pin, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        });
        const origin = () => {
          const r = art.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height * 0.6 };
        };
        q("[data-fly]").forEach((f, i) => {
          // The bubble leaves sideways with a small tilt, so it can't end up
          // jammed against the masthead letters above it.
          if (f.dataset.fly === "bub") {
            tl.to(f, { x: () => innerWidth * 0.55, y: () => -innerHeight * 0.1, rotation: 9, ease: "power2.in", duration: 1 }, 0);
            return;
          }
          const vec = () => {
            const o = origin();
            const r = f.getBoundingClientRect();
            const dx = r.left + r.width / 2 - o.x;
            const dy = r.top + r.height / 2 - o.y;
            const d = Math.hypot(dx, dy) || 1;
            return { x: dx / d, y: dy / d };
          };
          const k = 0.75 + (i % 3) * 0.2;
          tl.to(
            f,
            {
              xPercent: () => vec().x * 260 * k,
              yPercent: () => vec().y * 220 * k,
              x: () => vec().x * innerWidth * 0.18 * k,
              y: () => vec().y * innerHeight * 0.2 * k,
              rotation: (i % 2 ? 1 : -1) * (18 + i * 5),
              ease: "power2.in",
              duration: 1,
            },
            0
          );
        });
        tl.to(q("[data-rays-turn]"), { rotation: 55, scale: 1.25, ease: "none", duration: 1 }, 0)
          .to(q("[data-arch-in]"), { scale: 1.32, transformOrigin: "50% 100%", ease: "power1.inOut", duration: 1 }, 0)
          .to(q("[data-lines]"), { scale: 1.35, rotation: -8, ease: "none", duration: 1 }, 0)
          .to(q("[data-print]"), { rotation: 0, scale: 1.18, yPercent: -6, ease: "power2.inOut", duration: 1 }, 0)
          .to(q("[data-head-block]"), { yPercent: -55, ease: "power1.in", duration: 1 }, 0)
          .to(q("[data-fade-out]"), { opacity: 0, ease: "power1.in", duration: 0.4 }, 0)
          // Links and the CTA leave with visibility too (autoAlpha), so focus
          // can't land on them while they are invisible.
          .to(q("[data-hide-out]"), { autoAlpha: 0, ease: "power1.in", duration: 0.4 }, 0)
          .to(q("[data-side]"), { autoAlpha: 0, y: -40, ease: "power1.in", duration: 0.4 }, 0)
          .to(q("[data-diagram]"), { opacity: 0, y: -60, ease: "power1.in", duration: 0.6 }, 0)
          .to(q("[data-chips]"), { autoAlpha: 0, y: 30, duration: 0.4 }, 0);
        const n = chars.length;
        const mid = (n - 1) / 2;
        chars.forEach((c, i) => {
          const off = n > 1 ? (i - mid) / mid : 0;
          tl.to(c, { xPercent: off * 150, yPercent: -20 - Math.abs(off) * 60, rotation: off * 22, ease: "power1.inOut", duration: 1 }, 0);
        });
        // The letters finish the blow-apart by fading over the last third, so
        // no stumps are left along the top edge when the stage lets go.
        if (chars.length) {
          tl.fromTo(chars, { opacity: 1 }, { opacity: 0, ease: "power1.in", duration: 0.35, immediateRender: false }, 0.65);
        }
      });

      // Don't hold the cover on the fonts: build after they load or after
      // 1.2s, whichever comes first. The split is by characters, so it doesn't
      // depend on metrics; MotionProvider refreshes ScrollTrigger once the
      // fonts arrive.
      const fontsOrTimeout = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
      fontsOrTimeout.then(() => {
        if (!alive) return;
        build();
        ScrollTrigger.refresh();
      });

      return () => {
        alive = false;
        io.disconnect();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="top" className={s.cover} aria-labelledby="hero-title">
      <div className={s.pin}>
        <div className={s.stage} data-stage>
          <Construction side="l" />
          <Construction side="r" />

          {/* Masthead */}
          <div className={s.head}>
            <div className={s.headIn} data-head-block>
              <h1 id="hero-title" className={s.title} data-mast>
                <span className="sr-only">The Lab. </span>
                <span className={s.mast} aria-hidden="true">
                  <span className={s.mastText} data-mast-text>
                    THE LAB
                  </span>
                  <span className={s.reg} data-pop>
                    ®
                  </span>
                </span>
                <span className={s.tag} data-wipe data-fade-out>
                  <span lang="en">Creative worth</span> — estudio de contenido en Saltillo
                </span>
              </h1>
              <a className={`${s.mail} link`} href={`mailto:${CONTACT.email}`} data-wipe data-hide-out>
                {CONTACT.email}
              </a>
              <p className={`${s.made} note`} data-note data-fade-out>
                hecho en Saltillo
              </p>
            </div>
          </div>

          {/* The arch and everything pinned to it */}
          <div className={s.art} data-art>
            <svg className={s.lines} viewBox="-1500 -1500 3000 3000" aria-hidden="true" data-lines>
              {RAYS.map((r, i) =>
                r.dash ? (
                  <line key={i} className={s.dash} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} vectorEffect="non-scaling-stroke" data-fade />
                ) : (
                  <line key={i} className={s.solid} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} pathLength={1} vectorEffect="non-scaling-stroke" data-ray />
                )
              )}
              {RAYS.filter((r) => r.dot).map((r, i) => (
                <circle key={`d${i}`} className={s.rayDot} cx={r.dot![0]} cy={r.dot![1]} r="7" data-fade />
              ))}
            </svg>

            <div className={s.archLine} data-arch-in aria-hidden="true" />
            <div className={s.arch} data-arch-in aria-hidden="true">
              <div className={s.raysTurn} data-rays-turn>
                <div className={s.rays} data-rays />
              </div>
              <div className={s.archDots} />
              <div className={s.archGrain} />
            </div>

            <div className={`${s.fly} ${s.tagA}`} data-fly aria-hidden="true">
              <span className="tilt" style={{ "--rot": "-14deg" } as React.CSSProperties} data-pop>
                Grabamos
              </span>
            </div>
            <div className={`${s.fly} ${s.tagB}`} data-fly aria-hidden="true">
              <span className="tilt" style={{ "--rot": "12deg" } as React.CSSProperties} data-pop>
                Publicamos
              </span>
            </div>

            {/* The print: WU, through a halftone screen */}
            <div className={s.print} data-print>
              <figure className={`${s.printIn} plate`} data-print-in>
                <Halftone
                  className={s.printHt}
                  src={wu.image}
                  alt={wu.alt}
                  ink="ink"
                  focus={wu.focus}
                  sizes="(max-width: 760px) 44vw, 300px"
                  priority
                />
                <figcaption>
                  <span className={s.capLong}>Toma </span>N.º {plateNo("wu")} — {wu.title}
                </figcaption>
              </figure>
            </div>

            {/* Four plates floating round the arch, each a different frame */}
            <div className={`${s.fly} ${s.fA}`} data-fly>
              <figure className={`${s.sq} plate`} style={{ "--plate-shadow": mercato.color, "--plate-cap": mercato.color } as React.CSSProperties} data-pop>
                <div className={s.ph}>
                  <Image src={mercato.image} alt="" fill sizes="(max-width: 760px) 30vw, 170px" style={{ objectFit: "cover", objectPosition: "45% 45%" }} />
                </div>
                <figcaption>{mercato.title}</figcaption>
              </figure>
            </div>
            <div className={`${s.fly} ${s.fB}`} data-fly>
              <figure className={s.round} data-pop>
                <div className={s.ph}>
                  <Image src={rancho.image} alt="" fill sizes="(max-width: 760px) 26vw, 140px" style={{ objectFit: "cover", objectPosition: "50% 26%" }} />
                </div>
              </figure>
            </div>
            <div className={`${s.fly} ${s.fC}`} data-fly>
              <figure className={s.card} data-pop>
                <div className={s.ph}>
                  <Image src={zoco.image} alt="" fill sizes="(max-width: 760px) 26vw, 140px" style={{ objectFit: "cover", objectPosition: zoco.focus }} />
                </div>
                <figcaption className={s.cardCap}>
                  {zocoFirst}
                  {zocoRest.length > 0 && <span className={s.capLong}> {zocoRest.join(" ")}</span>}
                </figcaption>
              </figure>
            </div>
            <div className={`${s.fly} ${s.fD}`} data-fly>
              <figure className={s.land} data-pop>
                <div className={`${s.ph} ${s.vf}`}>
                  <Image src={collab.image} alt="" fill sizes="(max-width: 760px) 34vw, 190px" style={{ objectFit: "cover", objectPosition: collab.focus }} />
                  <span className={s.rec} aria-hidden="true">
                    Rec
                  </span>
                </div>
              </figure>
            </div>

            <div className={`${s.fly} ${s.bub}`} data-fly="bub">
              <p className="bubble" data-pop>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4.2v15.6L20 12z" fill="currentColor" />
                </svg>
                <span className={s.bubT}>
                  +25M de reproducciones <span>en un solo video</span>
                </span>
              </p>
            </div>
          </div>

          {/* Wide screens: the index and figure belong to the cover and pin with it. */}
          <Side stage />

          <div className={s.chips} data-chips>
            <p className={`${s.plateChip} chip`}>
              <span className="chip-k">Placa {plateNo("wu")}</span>
              <span className="chip-v">WU · 3 vitaminas para mujeres</span>
            </p>
            <Btn href="#contacto" sub="Respuesta < 2 días hábiles">
              Empezar un proyecto
            </Btn>
          </div>
        </div>
      </div>

      {/* Narrow screens: the index and figure follow the stage. */}
      <div className={`${s.extra} wrap`}>
        <Side />
      </div>
    </section>
  );
}
