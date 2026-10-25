"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { CONTACT, NAV } from "@/lib/content";
import s from "./footer.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MARK = "THE LAB";
const RING = "Creative worth ✶ Hecho en Saltillo ✶ The Lab® ✶ ";

/*
 * Footer (Corvel's footer grid and chips + Agentic's giant mark). Columns on
 * a ruled sheet, then the wordmark set to the full content width from its
 * character count, rising letter by letter out of a hairline as it comes in,
 * then the legal line.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  // The stamp only turns while the footer is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-off", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!motionOn()) return;
      const wrap = root.current!.querySelector<HTMLElement>("[data-mark]")!;
      const mark = wrap.firstElementChild as HTMLElement;
      const letters = wrap.querySelectorAll<HTMLElement>("[data-l]");
      // Letters rise out of the bottom rule one after another; the second
      // plate swings in from far off-register and settles.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "clamp(bottom bottom-=4%)", scrub: 0.6 },
      });
      tl.fromTo(letters, { yPercent: 102 }, { yPercent: 0, ease: "power2.out", stagger: 0.06 }, 0).fromTo(
        mark,
        { "--mis": "0.08em" },
        { "--mis": "0.018em", ease: "power1.out", duration: tl.duration() || 1 },
        0,
      );
      gsap.fromTo(
        root.current!.querySelectorAll("[data-col]"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current!, start: "top 88%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={s.foot}>
      <div className={`wrap ${s.top}`}>
        <div className={s.lead} data-col>
          <p className={`mono ${s.h}`}>¿Hablamos?</p>
          <a className={`link ${s.big}`} href={`mailto:${CONTACT.email}`}>
            {CONTACT.email.split("@")[0]}
            <wbr />@{CONTACT.email.split("@")[1]}
          </a>
          <span className={`note ${s.note}`} aria-hidden="true">
            ¡nos vemos!
          </span>
        </div>
        <nav className={s.col} aria-label="Secciones (pie de página)" data-col>
          <p className={`mono ${s.h}`}>Secciones</p>
          <ul>
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a className="link" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.col} data-col>
          <p className={`mono ${s.h}`}>Contacto</p>
          <ul>
            <li>
              <a className="link" href={`mailto:${CONTACT.email}`}>
                Correo
              </a>
            </li>
            <li>
              <a className="link" href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
                Instagram {CONTACT.instagram}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={s.col} data-col>
          <p className={`mono ${s.h}`}>Estudio</p>
          <p>{CONTACT.location}</p>
          <p className={s.soft}>Especialistas en restaurantes y experiencias</p>
        </div>
      </div>

      <div className={`wrap ${s.chips}`}>
        <div className={s.stamp} aria-hidden="true">
          <svg className={s.stampRing} viewBox="0 0 100 100" focusable="false">
            <defs>
              <path id="foot-ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
            </defs>
            <circle cx="50" cy="50" r="47" />
            <circle cx="50" cy="50" r="29" />
            <text>
              <textPath href="#foot-ring" textLength="236" lengthAdjust="spacing">
                {RING.toUpperCase()}
              </textPath>
            </text>
          </svg>
          <span className={s.stampMark} />
        </div>
        <p className="chip">
          <span className="chip-k">Hecho en</span>
          <span className="chip-v">Saltillo, Coahuila</span>
        </p>
        <p className={`chip ${s.chipBlue}`}>
          <span className="chip-k">Crecimiento</span>
          <span className="chip-v">100% orgánico</span>
        </p>
      </div>

      <div className={`wrap ${s.markWrap}`} data-mark aria-hidden="true">
        <p className={s.mark} style={{ "--len": MARK.length } as React.CSSProperties}>
          {[...MARK].map((c, i) =>
            c === " " ? (
              <span key={i} className={s.sp}>
                {" "}
              </span>
            ) : (
              <span key={i} className={s.l} data-l>
                {c}
              </span>
            ),
          )}
          <span className={s.reg} data-l>
            ®
          </span>
        </p>
      </div>

      <div className={`wrap ${s.bottom}`}>
        <p>© 2026 The Lab®. Todos los derechos reservados.</p>
        <p className={`mono ${s.soft}`}>
          <span lang="en">Creative worth</span>.
        </p>
        <a className={`link ${s.up}`} href="#top">
          Volver arriba
          <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path d="M6 10.5V1.8M2 5.6 6 1.6l4 4" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
