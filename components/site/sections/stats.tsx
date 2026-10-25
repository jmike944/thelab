"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STATS } from "@/lib/content";
import { motionOn } from "../motion-provider";
import s from "./stats.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * The figures (after Corvel's stats band), on a blue inset panel (Agentic's
 * frame) with faint paper rays radiating from below it. The four numbers are
 * set huge in LAB with an ink key plate behind them and are stamped in when
 * the band arrives: overshoot from 1.45x and -9deg, staggered.
 */

/** "+43M" → "Más de 43 millones", for screen readers. */
function spoken(v: string) {
  const m = v.match(/^(\+)?([\d.,]+)([MK%])?$/);
  if (!m) return v;
  const [, plus, n, suf] = m;
  const unit = suf === "M" ? " millones" : suf === "K" ? " mil" : suf === "%" ? " por ciento" : "";
  return `${plus ? "Más de " : ""}${n}${unit}`;
}

/** Splits the sign and the percent off so they print in the second ink. */
function Figure({ v }: { v: string }) {
  const m = v.match(/^(\+?)(.*?)(%?)$/);
  const [, plus, core, pct] = m ?? ["", "", v, ""];
  return (
    <>
      {plus && <span className={s.plus}>{plus}</span>}
      {core}
      {pct && <span className={s.pct}>{pct}</span>}
    </>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOn()) return;
      const root = ref.current;
      if (!root) return;
      const list = root.querySelector("[data-figs]");
      const vals = gsap.utils.toArray<HTMLElement>("[data-stamp]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-rule]", root);
      const note = root.querySelector("[data-note]");

      const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 82%", once: true } });
      tl.fromTo(
        vals,
        { opacity: 0, scale: 1.45, rotation: -9 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.55,
          stagger: 0.14,
          ease: "back.out(2.2)",
          clearProps: "transform",
        },
      ).fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.14, ease: "power3.out" }, 0.12);
      if (note)
        tl.fromTo(
          note,
          { opacity: 0, scale: 0.35, rotation: -30 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.4)", clearProps: "transform" },
          ">-0.25",
        );

      // The rays turn slowly with the scroll.
      const rays = root.querySelector("[data-rays]");
      if (rays)
        gsap.fromTo(
          rays,
          { rotation: -8 },
          {
            rotation: 14,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={s.stats} aria-labelledby="stats-title">
      <div className={s.rays} aria-hidden="true">
        <div data-rays />
      </div>
      <span className={s.ramp} aria-hidden="true" />

      <div className={`wrap ${s.inner}`}>
        <div className={s.top}>
          <h2 id="stats-title" className={`mono sec-tag ${s.tag}`}>
            En números
          </h2>
          <p className={`mono ${s.meta}`} aria-hidden="true">
            <span>The Lab®</span>
            <span>Saltillo, Coahuila</span>
          </p>
        </div>

        <ul className={s.list} data-figs>
          {STATS.map((st, i) => {
            const last = i === STATS.length - 1;
            return (
              <li key={st.label} className={s.fig}>
                <p className={s.val}>
                  <span className={s.stamp} data-stamp aria-hidden="true">
                    <Figure v={st.value} />
                  </span>
                  <span className="sr-only">{spoken(st.value)}</span>
                </p>
                <span className={s.rule} data-rule aria-hidden="true" />
                <p className={`mono ${s.label}`}>
                  <span>{st.label}</span>
                  <span className={s.idx} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </p>
                {last && (
                  <span className={s.noteWrap} aria-hidden="true">
                    <span className={s.noteIn} data-note>
                      <svg className={s.arrow} viewBox="0 0 48 40" focusable="false">
                        <path d="M44 4C40 20 28 31 8 34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        <path d="M15 27l-8 7 9 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={`note ${s.note}`}>todo orgánico</span>
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
