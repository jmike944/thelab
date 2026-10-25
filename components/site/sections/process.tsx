"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { ColorBars } from "@/components/site/ui/color-bars";
import { Goo } from "@/components/site/ui/goo";
import { STEPS } from "@/lib/content";
import s from "./process.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const NUMERALS = ["uno", "dos", "tres"];
const SEEDS = [1207, 2311, 3433];
const TILTS = [-0.8, 0.8, -0.5];
const pad = (n: number) => String(n).padStart(2, "0");

function RegMark() {
  return (
    <svg className={s.reg} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="11" />
      <circle cx="22" cy="22" r="4.5" />
      <line x1="22" y1="1" x2="22" y2="43" />
      <line x1="1" y1="22" x2="43" y2="22" />
    </svg>
  );
}

/** The brand's test-card colours (brandbook p. 14), in its order, for the slug patches. */
const PATCHES = ["paper-hi", "yellow", "cyan", "green", "violet", "red", "blue"];

/**
 * Process (after Corvel's proofs and Prism's process): the studio's line as
 * three colour proofs that stick and stack as you scroll, each with the
 * brand's test-card colour bar, crop marks, a test-card swatch labelled
 * "Prueba de color", a hand-written numeral and a floating goo panel.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  // The goo panels bob only while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle(s.live, e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      if (!motionOn()) return;
      const root = ref.current;
      if (!root) return;
      let alive = true;
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-proof]"));

      // Each proof prints in: the colour bar runs across, the copy rises, the
      // numeral is written left to right.
      cards.forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%", once: true } });
        tl.fromTo(card.querySelector("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 0)
          .fromTo(
            card.querySelectorAll("[data-rise]"),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: "power3.out", clearProps: "transform" },
            0.15
          )
          .fromTo(
            card.querySelector("[data-art]"),
            { opacity: 0, y: 40, rotation: 4 },
            { opacity: 1, y: 0, rotation: 0, duration: 1, ease: "power3.out", clearProps: "transform" },
            0.1
          )
          .fromTo(
            card.querySelector("[data-num]"),
            { clipPath: "inset(-40% 100% -40% -20%)" },
            { clipPath: "inset(-40% -20% -40% -20%)", duration: 0.9, ease: "power2.inOut" },
            0.45
          );
      });

      // Depth: while the next proofs slide over, the earlier ones sink back.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        const last = cards[cards.length - 1];
        const stickTop = (el: HTMLElement) => parseFloat(getComputedStyle(el).top) || 0;
        cards.slice(0, -1).forEach((card, i) => {
          const depth = cards.length - 1 - i;
          gsap.to(card, {
            scale: 1 - 0.04 * depth,
            "--shade": 0.05 * depth,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              endTrigger: last,
              end: () => `top ${stickTop(last)}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      const title = root.querySelector<HTMLElement>("[data-split]");
      if (title) {
        // Created once the face has loaded, but inside this context so a
        // revert un-splits it.
        const split = contextSafe!(() => {
          if (!alive || !title.isConnected) return;
          SplitText.create(title, {
            type: "lines",
            mask: "lines",
            // Names the mask wrappers ("pr-line-mask") so the CSS can give
            // them headroom: the accent on CÓMO sits above the line box.
            linesClass: "pr-line",
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
          ScrollTrigger.refresh();
        });
        document.fonts.ready.then(split);
      }

      return () => {
        alive = false;
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="proceso" aria-labelledby="proceso-title" className={`sec ${s.process}`}>
      <div className="wrap">
        <header className={`sec-head ${s.head}`}>
          <div>
            <p className="sec-tag mono">Proceso</p>
            <h2 id="proceso-title" className="h2" data-split>
              Cómo trabajamos
              <span className="stop" aria-hidden="true" />
            </h2>
          </div>
          <div className={s.ledeCol}>
            <p className="lede">Nuestra frase, convertida en método: contenido que se siente, se entiende y se queda.</p>
            <p className={`note ${s.hand}`} aria-hidden="true">
              {STEPS.length} pasos
              <svg viewBox="0 0 40 60" className={s.arrow}>
                <path d="M10 4 C 26 16, 30 34, 20 54" />
                <path d="M12 46 L 20 55 L 29 47" />
              </svg>
            </p>
          </div>
        </header>

        <ol className={s.proofs}>
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={s.proof}
              data-proof
              style={{ "--i": i, "--tilt": `${TILTS[i]}deg` } as React.CSSProperties}
            >
              <span className={s.crops} aria-hidden="true" />
              <span className={s.bar} data-bar aria-hidden="true" />

              <div className={s.inner}>
                <div className={s.copy}>
                  <div className={`mono ${s.meta}`} data-rise>
                    <span>
                      Paso {pad(i + 1)} / {pad(STEPS.length)}
                    </span>
                    <span className={s.metaR} aria-hidden="true">
                      <ColorBars className={s.swatch} />
                      Prueba de color
                    </span>
                  </div>
                  <h3 className={s.title} data-rise>
                    {step.title}
                    <span className="stop" aria-hidden="true" />
                  </h3>
                  <p className={s.text} data-rise>
                    {step.text}
                  </p>
                  <div className={s.slug} aria-hidden="true" data-rise>
                    <RegMark />
                    <span className={s.patches}>
                      {PATCHES.map((c) => (
                        <i key={c} style={{ background: `var(--${c})` }} />
                      ))}
                    </span>
                    <span className="mono">The Lab® · Prueba {pad(i + 1)}</span>
                  </div>
                </div>

                <div className={s.artCol} aria-hidden="true" data-art>
                  <div className={s.art}>
                    <Goo cols={6} rows={6} seed={SEEDS[i]} className={`${s.goo} ${s.gooLg}`} />
                    <Goo size="sm" cols={5} rows={4} seed={SEEDS[i] + 7} className={`${s.goo} ${s.gooSm}`} />
                    <span className={`chip ${s.artTag}`}>
                      <span className="chip-k">Prueba {pad(i + 1)}</span>
                      <span className="chip-v">{step.title}</span>
                    </span>
                  </div>
                  <span className={s.numeral} data-num>
                    {NUMERALS[i]}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
