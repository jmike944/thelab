"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { PROJECTS, type Project } from "@/lib/content";
import { motionOn } from "../motion-provider";
import s from "./work.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/*
 * Selected work: an Agentic dark inset panel holding Corvel's horizontally
 * pinned portfolio. Each project is a printed spread on paper-hi, tilted a
 * little, with a hard offset shadow in the project's own ink: the photo as a
 * plate on the left, a huge year printed in that ink with an ink key plate
 * behind it on the right, and a dotted-leader spec sheet at its foot. On wide
 * screens with motion the stage sticks and the track scrubs sideways (the
 * pin's height grows by the travel distance, estimated in CSS before any JS
 * runs), with a magenta progress rule, a live counter and an index that jumps
 * to a spread. Without motion, or under 900px, the spreads simply stack.
 */

const NOTES: Partial<Record<string, string>> = { wu: "¡viral!", rancho: "puro norte" };
const RESULTS: Partial<Record<string, React.ReactNode>> = {
  wu: (
    <>
      +25M de reproducciones · 444K <span lang="en">likes</span>
    </>
  ),
};

const pad = (n: number) => String(n).padStart(2, "0");
const YEARS = [...new Set(PROJECTS.map((p) => p.year))].sort();

/** gsap's matchMedia lifecycle event (not in its typings). */
type GsapEvents = {
  addEventListener(type: "matchMediaInit", fn: () => void): void;
  removeEventListener(type: "matchMediaInit", fn: () => void): void;
};

/**
 * Keeps the reader's place when the layout changes under them: a window
 * resized (above all across 900px), a tablet rotated. Crossing a breakpoint
 * makes gsap.matchMedia revert and rebuild every scene, and ScrollTrigger's
 * refresh then leaves the page at the top; and as the pinned work scene is
 * ~5,000px taller than the stacked one (and other sections reflow too), a raw
 * scrollY would land somewhere else anyway. So while the reader scrolls, the
 * place is remembered as "this block, this far through it" (inside Work:
 * "this spread"), and once the scenes have been rebuilt and refreshed for the
 * new size it is put back. Only width changes count: a phone's address bar
 * changing the height must never move the page under a finger.
 */
function keepPlace(work: HTMLElement) {
  type Place = { el: HTMLElement; ratio: number } | { card: HTMLElement };
  let place: Place | null = null;
  let pending: Place | null = null;
  let pendingAt = 0;
  let inMedia = false;
  let seenW = window.innerWidth;
  let timer = 0;

  const parts = () => ({
    pin: work.querySelector<HTMLElement>("[data-pin]"),
    stage: work.querySelector<HTMLElement>("[data-stage]"),
    track: work.querySelector<HTMLElement>("[data-track]"),
    cards: gsap.utils.toArray<HTMLElement>("[data-card]", work),
  });
  const isPinned = (stage: HTMLElement) => getComputedStyle(stage).position === "sticky";
  const nearest = (cards: HTMLElement[], at: (c: HTMLElement) => number, to: number) =>
    cards.reduce((a, b) => (Math.abs(at(b) - to) < Math.abs(at(a) - to) ? b : a));

  /** The spread being looked at, when the reader is inside the work scene. */
  const cardInView = () => {
    const { pin, stage, cards } = parts();
    if (!pin || !stage || !cards.length) return null;
    const vh = window.innerHeight;
    if (isPinned(stage)) {
      const r = pin.getBoundingClientRect();
      if (r.top > 1 || r.bottom < vh - 1) return null;
      return nearest(cards, (c) => c.offsetLeft + c.offsetWidth / 2, -r.top + stage.clientWidth / 2);
    }
    const first = cards[0].getBoundingClientRect();
    const last = cards[cards.length - 1].getBoundingClientRect();
    if (first.top > vh / 2 || last.bottom < vh / 2) return null;
    return nearest(cards, (c) => {
      const b = c.getBoundingClientRect();
      return b.top + b.height / 2;
    }, vh / 2);
  };

  const capture = () => {
    if (pending) return;
    seenW = window.innerWidth;
    const card = cardInView();
    if (card) {
      place = { card };
      return;
    }
    for (const el of document.querySelectorAll<HTMLElement>("main > *, body > footer")) {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.height > 0) {
        place = { el, ratio: gsap.utils.clamp(0, 1, -r.top / r.height) };
        return;
      }
    }
  };

  const target = (p: Place) => {
    const vh = window.innerHeight;
    if ("card" in p) {
      const { pin, stage, track } = parts();
      if (pin && stage && track && isPinned(stage)) {
        const dist = Math.max(0, track.scrollWidth - stage.clientWidth);
        const x = gsap.utils.clamp(0, dist, p.card.offsetLeft + p.card.offsetWidth / 2 - stage.clientWidth / 2);
        return pin.getBoundingClientRect().top + window.scrollY + x;
      }
      const b = p.card.getBoundingClientRect();
      return b.top + window.scrollY - (b.height < vh - 96 ? (vh - b.height) / 2 : 80);
    }
    const r = p.el.getBoundingClientRect();
    return r.top + window.scrollY + p.ratio * r.height;
  };

  const restore = () => {
    const p = pending;
    pending = null;
    if (p) {
      const y = Math.max(0, Math.round(target(p)));
      if (Math.abs(y - window.scrollY) > 1) {
        // Move the page and ScrollTrigger's cached position together, then
        // Lenis (with fresh limits: the document height just changed).
        ScrollTrigger.getScrollFunc(window)(y);
        const lenis = window.__lenis;
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(y, { immediate: true, force: true });
        }
        ScrollTrigger.update();
        // Scrubbed scenes would otherwise glide over from where the refresh
        // left them. (getTween() is falsy, not undefined, without a scrub tween.)
        ScrollTrigger.getAll().forEach((t) => {
          const scrub = t.getTween();
          if (scrub) scrub.progress(1);
        });
      }
    }
    capture();
  };

  /** The layout is about to change: hold on to the place read before it did. */
  const hold = () => {
    if (pending || !place) return;
    pending = place;
    pendingAt = performance.now();
  };
  const onResize = () => {
    if (window.innerWidth !== seenW) hold();
  };
  // A breakpoint flip: scenes are reverted and rebuilt synchronously, then
  // ScrollTrigger refreshes and fires "matchMedia"; refreshes in between are
  // part of the rebuild, so the place goes back only at the end.
  const onMediaInit = () => {
    hold();
    inMedia = true;
    requestAnimationFrame(() => (inMedia = false));
  };
  const onMedia = () => {
    inMedia = false;
    restore();
  };
  const onRefresh = () => {
    if (!inMedia) restore();
  };
  // If the reader scrolls before the refresh comes, their scroll wins.
  const onInput = () => {
    if (pending && !inMedia) pending = null;
  };
  const onScroll = () => {
    if (timer) return;
    timer = window.setTimeout(() => {
      timer = 0;
      if (pending) {
        // Waiting for the refresh; but never for one that didn't come.
        if (performance.now() - pendingAt > 3000) {
          pending = null;
          capture();
        }
        return;
      }
      // The width changed and the resize hasn't been handled yet: wait.
      if (window.innerWidth === seenW) capture();
    }, 120);
  };
  const events = gsap as unknown as GsapEvents;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  for (const type of ["wheel", "touchmove", "keydown"]) window.addEventListener(type, onInput, { passive: true });
  events.addEventListener("matchMediaInit", onMediaInit);
  ScrollTrigger.addEventListener("refresh", onRefresh);
  ScrollTrigger.addEventListener("matchMedia", onMedia);
  capture();

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    for (const type of ["wheel", "touchmove", "keydown"]) window.removeEventListener(type, onInput);
    events.removeEventListener("matchMediaInit", onMediaInit);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    ScrollTrigger.removeEventListener("matchMedia", onMedia);
  };
}

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 64 34" aria-hidden="true" focusable="false">
      <path d="M61 6c-9 13-27 21-50 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 16l-7 8 9 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spread({ p, i }: { p: Project; i: number }) {
  const num = pad(i + 1);
  const note = NOTES[p.id];
  const result = RESULTS[p.id];
  const showClient = p.client.toLowerCase() !== p.title.toLowerCase();

  return (
    <article
      className={s.spread}
      data-card
      aria-labelledby={`work-${p.id}`}
      style={{ "--c": p.color, "--tilt": `${i % 2 ? 0.8 : -1}deg` } as React.CSSProperties}
    >
      <span className={s.crop} aria-hidden="true" />
      <figure className={s.ph}>
        <div className={s.phImg} data-par>
          <Image
            src={p.image}
            alt={p.alt}
            fill
            sizes="(min-width: 900px) 540px, (min-width: 700px) 40vw, 92vw"
            style={{ objectFit: "cover", objectPosition: p.focus }}
          />
        </div>
        <figcaption className={`chip ${s.plate}`}>
          <span className="chip-k">Placa</span>
          <span className="chip-v">{num}</span>
        </figcaption>
      </figure>

      <div className={s.txt}>
        <div className={s.meta} aria-hidden="true">
          <span className="mono">
            N.º {num} <span className={s.of}>/ {pad(PROJECTS.length)}</span>
          </span>
          <span className={s.swatches}>
            {PROJECTS.map((q) => (
              <i key={q.id} style={{ background: q.color }} data-on={q.id === p.id || undefined} />
            ))}
          </span>
        </div>

        <div className={s.yearRow}>
          <p className={s.year}>
            <span className="sr-only">Año </span>
            {p.year}
          </p>
          {note && (
            <span className={s.noteWrap} data-note aria-hidden="true">
              <Arrow />
              <span className={`note ${s.note}`}>{note}</span>
            </span>
          )}
        </div>

        <h3 id={`work-${p.id}`} className={s.name}>
          <span className={s.title}>
            {p.title}
            <span className="stop" aria-hidden="true" />
          </span>
          {showClient && <span className={s.client}>{p.client}</span>}
        </h3>

        <p className={s.blurb}>{p.blurb}</p>
        {result && (
          <p className={`mono ${s.result}`}>
            <span>{result}</span>
          </p>
        )}

        {/* The sheet's spec, set with dotted leaders. On the pinned spread it
            fills whatever height is left and drops rows that don't fit. */}
        <div className={s.foot}>
          <dl className={s.spec}>
            <div>
              <dt>Categoría</dt>
              <dd>{p.category}</dd>
            </div>
            <div aria-hidden={showClient || undefined}>
              <dt>Cliente</dt>
              <dd>{p.client}</dd>
            </div>
            <div aria-hidden="true">
              <dt>Año</dt>
              <dd>{p.year}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const goRef = useRef<((i: number) => void) | null>(null);

  useGSAP(
    () => {
      if (!motionOn()) return;
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      const unkeep = keepPlace(root);
      let alive = true;

      document.fonts.ready.then(() => {
        if (!alive) return;
        mm.add({ wide: "(min-width: 900px)", narrow: "(max-width: 899.98px)" }, (ctx) => {
          const { wide } = ctx.conditions as { wide: boolean; narrow: boolean };
          const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);

          // Head: the title's letters rise out of a line mask (Agentic). The
          // masks get a class so the CSS can give accents headroom.
          const h2 = q("[data-split]");
          if (h2) {
            SplitText.create(h2, {
              type: "lines,chars",
              mask: "lines",
              linesClass: "work-line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.chars, {
                  yPercent: 115,
                  rotation: 7,
                  duration: 1,
                  stagger: 0.028,
                  ease: "power4.out",
                  scrollTrigger: { trigger: h2, start: "top 88%", once: true },
                }),
            });
          }
          const aside = gsap.utils.toArray<HTMLElement>("[data-rise]", root);
          gsap.from(aside, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: aside[0], start: "top 90%", once: true },
          });

          const pin = q("[data-pin]");
          const stage = q("[data-stage]");
          const track = q("[data-track]");
          if (!pin || !stage || !track) return;
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);

          if (!wide) {
            // Stacked: each spread lifts in as it arrives.
            cards.forEach((card) =>
              gsap.from(card, {
                y: 64,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 90%", once: true },
              }),
            );
            return;
          }

          // Pinned: the stage is sticky (CSS); the pin grows by the travel.
          // CSS already estimates --dist from the same geometry so the page is
          // the right height at first paint; this sets the exact px.
          const bar = q("[data-progress]");
          const now = q("[data-now]");
          const items = gsap.utils.toArray<HTMLElement>("[data-go]", root);
          const dist = () => Math.max(0, track.scrollWidth - stage.clientWidth);
          const setDist = () => pin.style.setProperty("--dist", `${dist()}px`);
          setDist();

          let active = -1;
          const setActive = (x: number) => {
            const mid = x + stage.clientWidth / 2;
            let best = 0;
            let bestD = Infinity;
            cards.forEach((c, i) => {
              const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
              if (d < bestD) {
                bestD = d;
                best = i;
              }
            });
            if (best === active) return;
            active = best;
            if (now) now.textContent = pad(best + 1);
            items.forEach((it, i) => {
              if (i === best) it.setAttribute("aria-current", "true");
              else it.removeAttribute("aria-current");
            });
          };
          // Progress rule, counter and index follow the scrubbed position the
          // track actually shows.
          const paint = (p: number) => {
            if (bar) bar.style.transform = `scaleX(${p})`;
            setActive(p * dist());
          };

          const tween = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${dist()}`,
              scrub: 0.5,
              invalidateOnRefresh: true,
              onRefreshInit: setDist,
              // A refresh (reload, deep link, resize) sets the scrubbed
              // progress silently, without onUpdate: repaint from it.
              onRefresh: (self) => paint(self.animation ? self.animation.progress() : self.progress),
            },
            onUpdate(this: gsap.core.Tween) {
              paint(this.progress());
            },
          });
          paint(tween.progress());

          cards.forEach((card) => {
            // The photo drifts inside its plate as the spread crosses the stage.
            const img = card.querySelector("[data-par]");
            if (img)
              gsap.fromTo(
                img,
                { xPercent: -6 },
                {
                  xPercent: 6,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: tween,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            // Hand notes are scribbled on as their spread reaches the middle.
            // (A spread already on stage when the pin starts uses a plain trigger.)
            const note = card.querySelector("[data-note]");
            if (note) {
              const onStage = card.offsetLeft < stage.clientWidth * 0.62;
              gsap.from(note, {
                scale: 0.3,
                rotation: -24,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(2.4)",
                scrollTrigger: onStage
                  ? { trigger: pin, start: "top 55%", toggleActions: "play none none reverse" }
                  : {
                      trigger: card,
                      containerAnimation: tween,
                      start: "left 62%",
                      toggleActions: "play none none reverse",
                    },
              });
            }
          });

          goRef.current = (i: number) => {
            const st = tween.scrollTrigger;
            const card = cards[i];
            if (!st || !card) return;
            const x = gsap.utils.clamp(0, dist(), card.offsetLeft + card.offsetWidth / 2 - stage.clientWidth / 2);
            const y = st.start + x;
            if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          };

          return () => {
            goRef.current = null;
            pin.style.removeProperty("--dist");
          };
        });
        // Measure once the scenes exist (a breakpoint change refreshes by itself).
        ScrollTrigger.refresh();
      });

      return () => {
        alive = false;
        unkeep();
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="trabajo" className={`panel ${s.work}`} data-tone="dark" aria-labelledby="work-title">
      <div className={`wrap sec-head ${s.head}`}>
        <div>
          <p className="mono sec-tag">Trabajo seleccionado</p>
          <h2 id="work-title" className={`h2 ${s.h2}`} data-split>
            Hecho en The Lab<span className="stop" aria-hidden="true" />
          </h2>
        </div>
        <div className={s.aside}>
          <p className="lede" data-rise>
            Seis proyectos recientes: contenido viral, storytelling, collabs, producción, cobertura y campañas.
          </p>
          <p className={`mono ${s.pill}`} data-rise>
            <i aria-hidden="true" />
            <b>{PROJECTS.length}</b> proyectos · {YEARS.join("–")}
          </p>
        </div>
      </div>

      <div className={s.pin} data-pin style={{ "--n": PROJECTS.length } as React.CSSProperties}>
        <div className={s.stage} data-stage>
          <span className={s.marks} aria-hidden="true" />
          <div className={s.track} data-track>
            {PROJECTS.map((p, i) => (
              <Spread key={p.id} p={p} i={i} />
            ))}
          </div>

          <div className={s.bar}>
            <span className={s.progress} aria-hidden="true">
              <i data-progress />
            </span>
            <p className={`mono ${s.count}`} aria-hidden="true">
              <b data-now>01</b> / {pad(PROJECTS.length)}
            </p>
            <nav className={s.index} aria-label="Ir a un proyecto">
              <ol>
                {PROJECTS.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="mono"
                      data-go
                      aria-current={i === 0 ? "true" : undefined}
                      onClick={() => goRef.current?.(i)}
                    >
                      <span aria-hidden="true">{pad(i + 1)}</span> {p.title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <p className={`mono ${s.hint}`} aria-hidden="true">
              Desliza <span>→</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
