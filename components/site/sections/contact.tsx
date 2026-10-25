"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import { Btn } from "@/components/site/ui/btn";
import { Goo } from "@/components/site/ui/goo";
import { Signature } from "@/components/site/ui/signature";
import { CONTACT, INTERESTS, TEAM } from "@/lib/content";
import s from "./contact.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const UNSURE = "Aún no sé";
const NS = "http://www.w3.org/2000/svg";

type Ray = {
  l: SVGLineElement;
  dot: SVGCircleElement | null;
  a: number;
  /** Draw progress of the line and of its end dot (0..1). */
  p: number;
  d: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/*
 * Contact (Agentic's dark CTA panel + Corvel's sunburst lines + Prism goo).
 * The panel's background is a goo composition dimmed by an ink gradient on
 * the copy side; rays drawn out from the form card run to the panel edges as
 * you scroll in. The form builds a mailto: with everything filled in.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rays = useRef<Ray[]>([]);
  const paintRef = useRef<() => void>(() => {});

  // Goo cell count follows the panel's pixel size (~6 cells per 500px).
  const [grid, setGrid] = useState({ cols: 17, rows: 11 });

  // Form state
  const nameRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [brief, setBrief] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; brief?: string }>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let t = 0;
    const fit = () => {
      const r = panel.getBoundingClientRect();
      const cols = Math.max(4, Math.min(20, Math.round(r.width / 84)));
      const rows = Math.max(4, Math.min(26, Math.round(r.height / 84)));
      setGrid((g) => (g.cols === cols && g.rows === rows ? g : { cols, rows }));
    };
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(fit, 120);
    });
    ro.observe(panel);
    fit();
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Sunburst rays (Corvel's data-burst-lines): from just outside the card to past the panel edge.
  // A layout effect, so the rays exist before useGSAP (also a layout effect) animates them.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    const panel = panelRef.current;
    const card = cardRef.current;
    if (!svg || !panel || !card) return;
    const n = window.innerWidth < 700 ? 24 : 38;
    const list: Ray[] = [];
    svg.replaceChildren();
    for (let i = 0; i < n; i++) {
      const l = document.createElementNS(NS, "line");
      if (i % 4 === 2) l.setAttribute("class", s.dash);
      svg.append(l);
      let dot: SVGCircleElement | null = null;
      if (i % 3 === 0) {
        dot = document.createElementNS(NS, "circle");
        svg.append(dot);
      }
      const a = ((i + 0.35 * Math.sin(i * 2.1)) / n) * Math.PI * 2;
      const on = motionOn() ? 0 : 1;
      list.push({ l, dot, a, p: on, d: on, x1: 0, y1: 0, x2: 0, y2: 0 });
    }
    rays.current = list;

    const paint = () => {
      for (const r of rays.current) {
        r.l.setAttribute("x1", r.x1.toFixed(1));
        r.l.setAttribute("y1", r.y1.toFixed(1));
        r.l.setAttribute("x2", (r.x1 + (r.x2 - r.x1) * r.p).toFixed(1));
        r.l.setAttribute("y2", (r.y1 + (r.y2 - r.y1) * r.p).toFixed(1));
        r.l.style.opacity = r.p > 0.001 ? "" : "0";
        if (r.dot) {
          const cos = Math.cos(r.a);
          const sin = Math.sin(r.a);
          r.dot.setAttribute("cx", (r.x2 + cos * 6.5).toFixed(1));
          r.dot.setAttribute("cy", (r.y2 + sin * 6.5).toFixed(1));
          r.dot.setAttribute("r", (6.5 * r.d).toFixed(2));
        }
      }
    };
    paintRef.current = paint;

    const layout = () => {
      const pr = panel.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const W = pr.width;
      const H = pr.height;
      const cx = cr.left - pr.left + cr.width / 2;
      const cy = cr.top - pr.top + cr.height / 2;
      const rx = cr.width / 2 + 28;
      const ry = cr.height / 2 + 28;
      const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
      svg.setAttribute("viewBox", `0 0 ${W.toFixed(0)} ${H.toFixed(0)}`);
      rays.current.forEach((r, i) => {
        const cos = Math.cos(r.a);
        const sin = Math.sin(r.a);
        const r0 = 1 / Math.sqrt((cos * cos) / (rx * rx) + (sin * sin) / (ry * ry));
        const r1 = r.dot ? r0 + 70 + ((i * 53) % 150) : R;
        r.x1 = cx + cos * r0;
        r.y1 = cy + sin * r0;
        r.x2 = cx + cos * r1;
        r.y2 = cy + sin * r1;
      });
      paint();
    };
    layout();
    let t = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(layout, 120);
    });
    ro.observe(panel);
    ro.observe(card);
    document.fonts.ready.then(layout);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  useGSAP(
    () => {
      if (!motionOn()) return;
      const sec = root.current!;
      const title = sec.querySelector<HTMLElement>("[data-rise]")!;
      const stop = sec.querySelector<HTMLElement>("[data-stop]")!;

      // Letters rise out of their words, one by one (Agentic's data-rise).
      // Words and chars don't depend on line breaks, so one split is enough.
      const split = SplitText.create(title, { type: "words,chars", wordsClass: s.word, charsClass: s.char });
      gsap.fromTo(
        [...split.chars, stop],
        { yPercent: 130 },
        {
          yPercent: 0,
          ease: "power3.out",
          duration: 1.1,
          stagger: 0.035,
          scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none reverse" },
        },
      );

      // The rays draw out, then their dots pop on.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: "top 80%", end: "center 50%", scrub: 0.7 },
        onUpdate: () => paintRef.current(),
      });
      const lines = rays.current;
      const dotted = lines.filter((r) => r.dot);
      tl.fromTo(lines, { p: 0 }, { p: 1, ease: "power2.out", duration: 1, stagger: { each: 0.02, from: "random" } }, 0);
      if (dotted.length) tl.fromTo(dotted, { d: 0 }, { d: 1, ease: "back.out(3)", duration: 0.3, stagger: { each: 0.03, from: "random" } }, 0.75);

      // The business card drops onto the panel; its tagline swings round to rest,
      // like the turned headers on the brandbook's cards (p. 22).
      const biz = sec.querySelector<HTMLElement>("[data-biz]");
      if (biz) {
        const bt = { trigger: biz, start: "top 92%", toggleActions: "play none none reverse" };
        gsap.fromTo(biz, { y: 48, rotate: -7 }, { y: 0, rotate: -2, ease: "power3.out", duration: 1, scrollTrigger: { ...bt } });
        gsap.fromTo(
          biz.querySelector("[data-biz-tilt]"),
          { rotate: -28 },
          { rotate: 4, ease: "back.out(2.2)", duration: 1.2, delay: 0.15, scrollTrigger: { ...bt } },
        );
      }

      // The card lands with a hard shadow.
      gsap.fromTo(
        cardRef.current,
        { y: 60, rotate: 1.5 },
        { y: 0, rotate: 0, ease: "power3.out", duration: 1.1, scrollTrigger: { trigger: cardRef.current, start: "top 92%" } },
      );
    },
    { scope: root },
  );

  const toggle = (item: string) => {
    setPicked((cur) => {
      if (cur.includes(item)) return cur.filter((x) => x !== item);
      if (item === UNSURE) return [UNSURE];
      return [...cur.filter((x) => x !== UNSURE), item];
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n = name.trim();
    const b = brief.trim();
    const next: { name?: string; brief?: string } = {};
    if (!n) next.name = "Escribe tu nombre.";
    if (!b) next.brief = "Cuéntanos qué quieres crear.";
    setErrors(next);
    if (next.name || next.brief) {
      setSent(false);
      (next.name ? nameRef.current : briefRef.current)?.focus();
      return;
    }
    const company = biz.trim();
    const wants = picked.filter((x) => x !== UNSURE);
    const body = [
      `Nombre: ${n}`,
      ...(company ? [`Marca o negocio: ${company}`] : []),
      `Me interesa: ${wants.length ? wants.join(", ") : UNSURE}`,
      "",
      b,
    ].join("\r\n");
    const subject = `Nuevo proyecto: ${company || n}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section ref={root} id="contacto" data-tone="dark" aria-labelledby="contact-title" className={s.contact}>
      <div ref={panelRef} className={`panel ${s.panel}`}>
        <div className={s.bg} aria-hidden="true">
          <Goo cols={grid.cols} rows={grid.rows} seed={1907} beat={9000} className={s.goo} />
        </div>
        <svg ref={svgRef} className={s.burst} aria-hidden="true" focusable="false" />

        <div className={s.in}>
          <div className={s.copy}>
            <p className="sec-tag mono">Contacto</p>
            <h2 id="contact-title" className={s.title} data-rise>
              Empieza un proyecto
              <span className={s.stopMask}>
                <span className="stop" data-stop aria-hidden="true" />
              </span>
            </h2>
            <p className={s.lede}>Cuéntanos qué quieres crear. Te respondemos en menos de 2 días hábiles.</p>

            {/* The team as the brand's business card (brandbook p. 22): black logo, the tagline
                line and the handle tilted under it, then a dotted name ...... role line each. */}
            <div className={s.team}>
              <h3 id="contact-team-title" className={`mono ${s.teamTitle}`}>
                Quién te responde
              </h3>
              <div className={s.biz} data-biz role="group" aria-labelledby="contact-team-title">
                <div className={s.bizHead}>
                  <span className={`logo-mask ${s.bizLogo}`} role="img" aria-label="The Lab" />
                  <div className={s.bizTilt} data-biz-tilt>
                    <p className={`sig ${s.bizTag}`}>
                      <span className="sig-part" lang="en">
                        Creative Worth
                      </span>
                      <span className="sig-dots" aria-hidden="true" />
                      <span className="sr-only">, </span>
                      <span className="sig-part">México</span>
                    </p>
                    <p className={s.bizHandle}>{CONTACT.instagram}</p>
                  </div>
                </div>
                <div className={s.bizLines}>
                  {TEAM.map((p) => (
                    <Signature key={p.name} fill items={[p.name, p.role]} className={s.bizLine} />
                  ))}
                </div>
              </div>
            </div>

            <ul className={s.notes}>
              <li>
                <strong className="mono">Correo</strong>
                <a className="link" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <strong className="mono">Instagram</strong>
                <a className="link" href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
                  {CONTACT.instagram}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
              <li>
                <strong className="mono">Estudio</strong>
                {CONTACT.location}
              </li>
              <li>
                <strong className="mono">Respuesta</strong>
                {CONTACT.response}
              </li>
            </ul>
          </div>

          <div className={s.cardWrap}>
            <span className={`note ${s.note}`} aria-hidden="true">
              ¡cuéntanos todo!
            </span>
            <form ref={cardRef} className={s.card} onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title">
              <span className={`tilt ${s.tilt}`} aria-hidden="true">
                Respuesta &lt; 2 días hábiles
              </span>
              <div className={s.cardHead}>
                <p className={`chip ${s.to}`}>
                  <span className="chip-k">Para</span>
                  <span className="chip-v">
                    {CONTACT.email.split("@")[0]}
                    <wbr />@{CONTACT.email.split("@")[1]}
                  </span>
                </p>
                <h3 id="contact-form-title" className={s.formTitle}>
                  Tu proyecto
                </h3>
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="cf-name">
                  <span className={s.num} aria-hidden="true">
                    01
                  </span>
                  Nombre
                </label>
                <input
                  ref={nameRef}
                  id="cf-name"
                  name="name"
                  className={s.input}
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name && e.target.value.trim()) setErrors((x) => ({ ...x, name: undefined }));
                  }}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "cf-name-err" : undefined}
                />
                {errors.name && (
                  <p id="cf-name-err" className={s.err}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="cf-biz">
                  <span className={s.num} aria-hidden="true">
                    02
                  </span>
                  Marca o negocio <span className={s.opt}>(opcional)</span>
                </label>
                <input
                  id="cf-biz"
                  name="business"
                  className={s.input}
                  autoComplete="organization"
                  value={biz}
                  onChange={(e) => setBiz(e.target.value)}
                />
              </div>

              <fieldset className={s.fieldset}>
                <legend className={s.label}>
                  <span className={s.num} aria-hidden="true">
                    03
                  </span>
                  ¿Qué necesitas?
                </legend>
                <div className={s.picks}>
                  {INTERESTS.map((item) => {
                    const on = picked.includes(item);
                    return (
                      <button key={item} type="button" className={s.pick} aria-pressed={on} onClick={() => toggle(item)}>
                        <span className={s.pickBox} aria-hidden="true">
                          <svg viewBox="0 0 12 12" focusable="false">
                            <path d="M2.2 6.4 5 9l4.8-6" />
                          </svg>
                        </span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className={s.field}>
                <label className={s.label} htmlFor="cf-brief">
                  <span className={s.num} aria-hidden="true">
                    04
                  </span>
                  Cuéntanos de tu proyecto
                </label>
                <textarea
                  ref={briefRef}
                  id="cf-brief"
                  name="brief"
                  className={`${s.input} ${s.area}`}
                  rows={4}
                  required
                  value={brief}
                  onChange={(e) => {
                    setBrief(e.target.value);
                    if (errors.brief && e.target.value.trim()) setErrors((x) => ({ ...x, brief: undefined }));
                  }}
                  aria-invalid={errors.brief ? true : undefined}
                  aria-describedby={errors.brief ? "cf-brief-err" : undefined}
                />
                {errors.brief && (
                  <p id="cf-brief-err" className={s.err}>
                    {errors.brief}
                  </p>
                )}
              </div>

              <div className={s.send}>
                <Btn type="submit" sub="Abre tu correo">
                  Enviar por correo
                </Btn>
                <p className={s.small}>Se abre tu app de correo con el mensaje listo para enviar.</p>
              </div>
              <p className={s.status} role="status">
                {sent && (
                  <>
                    Abrimos tu app de correo con el mensaje listo. Si no se abrió, escríbenos a{" "}
                    <a className="link" href={`mailto:${CONTACT.email}`}>
                      {CONTACT.email}
                    </a>
                    .
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
