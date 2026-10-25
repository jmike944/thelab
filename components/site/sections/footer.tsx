"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { HandMark } from "@/components/site/ui/hand-mark";
import { LogoWheel } from "@/components/site/ui/logo-wheel";
import { Signature } from "@/components/site/ui/signature";
import { CONTACT, NAV } from "@/lib/content";
import s from "./footer.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MARK = "THE LAB";

/*
 * Footer (Corvel's footer grid and chips + Agentic's giant mark). Columns on
 * a ruled sheet; then the brand's orange visual (brandbook p. 21): the
 * cursive "The Lab" over the signature line on an orange field, with the
 * radial logo wheel (p. 18) turning beside it; the chips; the secondary logo
 * "THE LAB®" set to the full content width from its character count, rising
 * letter by letter out of a hairline as it comes in; then the legal line.
 * Everything moves by transform (and clip-path) only, and the footer clips
 * its own overflow, so its height is the same from first paint.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  // The wheel only turns while the footer is on screen.
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
      // The script writes itself in from the left as the orange band scrolls in.
      const band = root.current!.querySelector<HTMLElement>("[data-band]")!;
      gsap.fromTo(
        band.querySelector("[data-script]"),
        { clipPath: "inset(-10% 100% -10% -4%)" },
        {
          clipPath: "inset(-10% -4% -10% -4%)",
          ease: "none",
          scrollTrigger: { trigger: band, start: "top 85%", end: "center 55%", scrub: 0.5 },
        },
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

      {/* The brand's orange visual (brandbook p. 21) with the logo wheel (p. 18). A brand
          sign-off: the script and the signature repeat the name, place and tagline set out
          in the columns and the legal line, so the band is hidden from assistive tech. */}
      <div className={`field field--orange ${s.band}`} data-band aria-hidden="true">
        <div className={`wrap ${s.bandIn}`}>
          <div className={s.sign}>
            <p className={s.bandTop}>THE LAB®</p>
            <div className={s.script} data-script>
              <HandMark name="script" className={s.scriptMark} sizes="(max-width: 760px) 86vw, 46vw" />
            </div>
            <Signature className={s.sig} />
          </div>
          <div className={s.wheelHost}>
            <LogoWheel className={s.wheel} />
          </div>
        </div>
      </div>

      <div className={`wrap ${s.chips}`}>
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
        <p className={s.tagline}>
          <span lang="en">Creative Worth</span>
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
