"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { Halftone } from "@/components/site/ui/halftone";
import { CAPABILITIES, CLIENTS, CONTACT, PROJECTS, projectById } from "@/lib/content";
import s from "./story.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const rancho = projectById("rancho");
const pad = (n: number) => String(n).padStart(2, "0");
/** Plate numbers follow the portfolio's order (the Work track uses the same). */
const plate = `Placa ${pad(PROJECTS.indexOf(rancho) + 1)}`;
const SIZES = "(max-width: 860px) 88vw, (max-width: 1440px) 38vw, 540px";

/** Registration mark: a circle on a crosshair, printed once per plate. */
function RegMark({ className, plate }: { className: string; plate: "k" | "b" }) {
  return (
    <svg className={`${s.mark} ${className} ${plate === "b" ? s.markB : ""}`} viewBox="0 0 44 44" aria-hidden="true" data-mark={plate}>
      <circle cx="22" cy="22" r="11" />
      <circle cx="22" cy="22" r="4.5" />
      <line x1="22" y1="1" x2="22" y2="43" />
      <line x1="1" y1="22" x2="43" y2="22" />
    </svg>
  );
}

const CORNERS = [s.tl, s.tr, s.bl, s.br];

/**
 * The studio's story (after Corvel's feature): the Rancho photo printed twice,
 * an ink plate and a blue plate at different screen angles, that start out of
 * register and slide into place as you scroll, with the registration marks and
 * the headline's blue offset closing up with them.
 */
export function Story() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOn()) return;
      const root = ref.current;
      if (!root) return;
      const fig = root.querySelector<HTMLElement>("[data-reg]");
      const k = root.querySelector<HTMLElement>(`.${s.plateK}`);
      const b = root.querySelector<HTMLElement>(`.${s.plateB}`);
      const title = root.querySelector<HTMLElement>("[data-reg-title]");
      const marksB = root.querySelectorAll<SVGElement>('[data-mark="b"]');
      const marksK = root.querySelectorAll<SVGElement>('[data-mark="k"]');
      const ok = root.querySelector<HTMLElement>("[data-reg-ok]");
      if (!fig || !k || !b) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: fig, start: "top 88%", end: "center 42%", scrub: 0.8 },
      });
      tl.fromTo(b, { xPercent: -7, yPercent: 5, rotation: -2.4 }, { xPercent: 0, yPercent: 0, rotation: 0, ease: "power2.out", duration: 1 }, 0)
        .fromTo(k, { xPercent: 4, yPercent: -3, rotation: 0.6 }, { xPercent: 0, yPercent: 0, rotation: 0, ease: "power2.out", duration: 1 }, 0)
        .fromTo(marksB, { x: -26, y: 18, rotation: -14 }, { x: 0, y: 0, rotation: 0, ease: "power2.out", duration: 1 }, 0)
        .fromTo(marksK, { x: 10, y: -8 }, { x: 0, y: 0, ease: "power2.out", duration: 1 }, 0);
      if (title) {
        tl.fromTo(title, { "--mx": "0.09em", "--my": "-0.06em" }, { "--mx": "0em", "--my": "0em", ease: "power2.out", duration: 1 }, 0.05);
      }
      if (ok) {
        tl.fromTo(ok, { opacity: 0, scale: 0.4, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, ease: "back.out(2)", duration: 0.22 }, 0.86);
      }

      // Copy rises in once.
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="estudio" aria-labelledby="estudio-title" className={s.story}>
      <div className={`wrap ${s.sheet}`}>
        {/* Slug line along the sheet's top edge, outside the trim. */}
        <div className={`mono ${s.slug}`} aria-hidden="true">
          <span>The Lab® — Estudio de contenido</span>
          <span className={s.strip}>
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span>Tintas: K + azul · 45° / 15°</span>
        </div>

        <div className={s.trim}>
          <span className={s.crops} aria-hidden="true" />
          <div className={s.grid}>
            <figure className={s.reg} data-reg>
              <div className={s.stack}>
                <Halftone
                  className={`${s.plate} ${s.plateK}`}
                  src={rancho.image}
                  alt={rancho.alt}
                  ink="ink"
                  angle={45}
                  focus={rancho.focus}
                  sizes={SIZES}
                />
                <Halftone
                  className={`${s.plate} ${s.plateB}`}
                  src={rancho.image}
                  alt=""
                  ink="blue"
                  angle={15}
                  focus={rancho.focus}
                  sizes={SIZES}
                />
              </div>
              {CORNERS.map((c) => (
                <RegMark key={`k${c}`} className={c} plate="k" />
              ))}
              {CORNERS.map((c) => (
                <RegMark key={`b${c}`} className={c} plate="b" />
              ))}

              {/* Density scale printed down the plate's edge. */}
              <span className={s.scale} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={`mono ${s.edge}`} aria-hidden="true">
                {plate} · {rancho.category} · {rancho.year}
              </span>

              <span className={`note ${s.regNote}`} aria-hidden="true" data-reg-ok>
                ¡en registro!
                <svg viewBox="0 0 60 40" className={s.arrow}>
                  <path d="M4 6 C 22 4, 40 12, 50 32" />
                  <path d="M41 28 L 51 34 L 54 22" />
                </svg>
              </span>

              <figcaption className={`chip ${s.cap}`}>
                <span className="chip-k">{plate}</span>
                <span className="chip-v">{rancho.client}</span>
              </figcaption>
            </figure>

            <header className={s.head}>
              <p className="sec-tag mono">El estudio</p>
              <h2 id="estudio-title" className={`h2 ${s.title}`} data-reg-title>
                Lo que eres, convertido en contenido
                <span className="stop" aria-hidden="true" />
              </h2>
            </header>

            <div className={s.body}>
              <div className={s.cols} data-reveal>
                <p className={s.drop}>
                  The Lab es un estudio de contenido en Saltillo, Coahuila. Creamos contenido viral, fotografía, video y
                  community management para marcas que quieren rango: crecimiento real, hecho 100% orgánico.
                </p>
                <p>
                  Somos especialistas en restaurantes y experiencias: sabemos contar un platillo, una apertura o una noche de
                  cantina para que tu comunidad quiera vivirla. Convertimos lo que eres en contenido que se siente, se
                  entiende y se queda.
                </p>
              </div>

              <div className={s.foot} data-reveal>
                <p className={`note ${s.sign}`}>— The Lab, Saltillo</p>
                <ul className={s.facts} aria-label="El estudio en breve">
                  <li className="chip">
                    <span className="chip-k">Base</span>
                    <span className="chip-v">{CONTACT.city}</span>
                  </li>
                  <li className="chip">
                    <span className="chip-k">Clientes</span>
                    <span className="chip-v">{pad(CLIENTS.length)}</span>
                  </li>
                  <li className="chip">
                    <span className="chip-k">Capacidades</span>
                    <span className="chip-v">{pad(CAPABILITIES.length)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
