"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/components/site/motion-provider";
import s from "./film.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The identity film runs 48 s; shown until the file's metadata arrives. */
const FALLBACK_DURATION = 48;

/** The pinned scene (and the full-size film) only exist from this width up. */
const WIDE = "(min-width: 900px)";
const NARROW = "(max-width: 899.98px)";

/** How far the slot has opened (scroll progress) before the film starts. */
const OPEN_AT_WIDE = 0.55;
const OPEN_AT_NARROW = 0.6;

/** Save-Data or a 2G/3G link: no autoplay, no prefetch; the play button still works. */
const leanConnection = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /2g|3g/.test(c.effectiveType ?? ""));
};

type Playback = {
  /** What the visitor asked for with the button; null = leave it to the scroll. */
  intent: "play" | "pause" | null;
  /** The slot has opened far enough to show the film. */
  open: boolean;
  /** The film's screen is on screen. */
  visible: boolean;
  /** Autoplay allowed (motion on, not a lean connection). */
  auto: boolean;
};

const clock = (t: number) => {
  const sec = Math.max(0, Math.floor(t));
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
};

/** The title, split into the two halves that part (rendered twice: ink on paper, paper over the film). */
function TitleText() {
  return (
    <>
      <span className={s.half} data-half="a">
        Así se ve
      </span>{" "}
      <span className={s.half} data-half="b">
        The Lab
        <span className="stop" aria-hidden="true" />
      </span>
    </>
  );
}

/** A printer's registration mark (Corvel). */
function Reg({ className }: { className: string }) {
  return (
    <svg className={`${s.reg} ${className}`} viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <circle cx="14" cy="14" r="7.5" />
      <path d="M14 0v28M0 14h28" />
    </svg>
  );
}

/*
 * "Así se ve The Lab" (after Agentic's "Watch them think"). A pinned paper
 * stage: the title sits centred while a figure opens behind it from a thin
 * vertical slot (cut through the gap between the title's two halves) to the
 * full stage, and the two halves part to the edges by measured distances. A
 * paper-coloured copy of the title rides inside the figure (clipped to it),
 * moving by the same distances, so the title reads as cut in two inks. The
 * figure is the identity film: wide screens prefetch it when the section
 * comes near, phones get a lighter encode and fetch nothing until it plays.
 * It starts from the top only once the slot has opened (scroll), pauses off
 * screen, and has its own play/pause button (WCAG 2.2.2). Without motion:
 * title above, film below at 16:9, poster plus play button, nothing autoplays.
 */
export function Film() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pb = useRef<Playback>({ intent: null, open: false, visible: false, auto: false });
  const syncRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);

  // Prefetch when near (wide screens), play while open and on screen, pause otherwise.
  useEffect(() => {
    const v = videoRef.current;
    const sec = root.current;
    const screen = sec?.querySelector<HTMLElement>("[data-screen]");
    if (!v || !sec || !screen) return;
    v.muted = true;
    const p = pb.current;
    const lean = leanConnection();
    p.auto = motionOn() && !lean;

    // Autoplay waits for the open slot and for the page-wide "Pausar animaciones";
    // a film the visitor started with its own button plays whenever it's in view.
    const sync = () => {
      const held = document.documentElement.classList.contains("is-paused");
      const want = p.visible && (p.intent === "play" || (p.intent === null && p.auto && p.open && !held));
      if (want) {
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    };
    syncRef.current = sync;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => Number.isFinite(v.duration) && v.duration > 0 && setDuration(v.duration);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    window.addEventListener("lab:pause", sync);

    // Only wide screens buffer ahead (the reveal is a long pinned scroll away);
    // phones load the light encode when it starts to play.
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (p.auto && window.matchMedia(WIDE).matches) v.preload = "auto";
        near.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(sec);

    // The screen counts as visible once 15% of it shows; the observer applies the
    // slot's clip-path, so a thin slot doesn't count. The stage drives the
    // section's idle loops (data-off).
    const stage = sec.querySelector<HTMLElement>("[data-stage]") ?? sec;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === screen) {
            p.visible = e.isIntersecting;
            sync();
          } else {
            sec.toggleAttribute("data-off", !e.isIntersecting);
          }
        }
      },
      { threshold: 0.15 },
    );
    seen.observe(stage);
    seen.observe(screen);

    return () => {
      near.disconnect();
      seen.disconnect();
      window.removeEventListener("lab:pause", sync);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      pb.current.intent = "play";
      v.muted = true;
      v.play().catch(() => {});
    } else {
      pb.current.intent = "pause";
      v.pause();
    }
  };

  useGSAP(
    (_, contextSafe) => {
      if (!motionOn()) return;
      const sec = root.current!;
      const q = gsap.utils.selector(sec);
      const track = q("[data-track]")[0] as HTMLElement;
      const stage = q("[data-stage]")[0] as HTMLElement;
      const fig = q("[data-fig]")[0] as HTMLElement;
      const title = q("[data-title]")[0] as HTMLElement;
      const a = title.querySelector<HTMLElement>('[data-half="a"]')!;
      const b = title.querySelector<HTMLElement>('[data-half="b"]')!;
      const over = q("[data-over]")[0] as HTMLElement;
      const oa = over.querySelector<HTMLElement>('[data-half="a"]')!;
      const ob = over.querySelector<HTMLElement>('[data-half="b"]')!;
      const video = videoRef.current!;
      const screen = q("[data-screen]")[0] as HTMLElement;
      const fade = q("[data-fade]");
      const guides = q("[data-guide]");
      const cap = q("[data-cap]")[0];
      const css = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
      // Unary + drops trailing zeros ("51.2", not "51.200"): gsap 3.15 misreads
      // the padded form inside clip-path strings and blows the inset up ~100x.
      const pct = (px: number, of: number) => +((px / of) * 100).toFixed(3);

      // Each time the slot opens going forward (from closed), the reel starts again
      // from 0:00 rather than resuming mid-film. A film the visitor is playing by
      // hand keeps playing where it is.
      const setOpen = (on: boolean, forward = true) => {
        if (pb.current.open === on) return;
        pb.current.open = on;
        if (on && forward && video.paused) {
          video.currentTime = 0;
          setTime(0);
        }
        syncRef.current();
      };

      // A ScrollTrigger created while gsap.matchMedia switches branches (resize or
      // rotation across 900px) sends the page back to the top (gsap 3.15), so each
      // branch builds one frame later, outside the switch.
      const later = (ctx: gsap.Context, make: () => void | (() => void)) => {
        let id = requestAnimationFrame(() => {
          id = 0;
          ctx.add(make);
        });
        return () => {
          if (id) cancelAnimationFrame(id);
          setOpen(false);
        };
      };

      let alive = true;
      const mm = gsap.matchMedia();

      const build = contextSafe!(() => {
        if (!alive) return;

        // Desktop: the pinned split (the stage is sticky inside a tall track).
        mm.add(WIDE, (ctx) =>
          later(ctx, () => {
            const rel = (el: HTMLElement) => {
              let x = 0;
              for (let n: HTMLElement | null = el; n && n !== stage; n = n.offsetParent as HTMLElement | null) x += n.offsetLeft;
              return x;
            };
            const pad = () => parseFloat(getComputedStyle(title).paddingLeft) || 0;
            const shiftA = () => -(rel(a) - pad());
            const shiftB = () => stage.clientWidth - pad() - (rel(b) + b.offsetWidth);
            const frame = () => css("--frame");
            // The word gap between the halves. "Así se ve" is wider than "The Lab.",
            // so the gap sits right of centre (about 31px at 1440).
            const gapL = () => rel(a) + a.offsetWidth;
            const gapR = () => rel(b);
            const cut = () => (gapL() + gapR()) / 2;
            // The construction axis and the registration marks run down the cut.
            const mark = () => stage.style.setProperty("--cut", `${pct(cut(), stage.clientWidth)}%`);
            // The slot opens inside that gap, never over a letter.
            const slot = () => {
              const W = stage.clientWidth;
              const x = cut();
              const hw = Math.max(5, Math.min(14, (gapR() - gapL()) * 0.24));
              return `inset(31% ${pct(W - x - hw, W)}% 31% ${pct(x - hw, W)}% round ${+hw.toFixed(1)}px)`;
            };
            const opened = (self: ScrollTrigger) => setOpen(self.progress >= OPEN_AT_WIDE, self.direction >= 0);

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: track,
                start: () => `top top+=${frame()}`,
                end: () => `bottom bottom-=${frame()}`,
                scrub: true,
                invalidateOnRefresh: true,
                onRefresh: (self) => {
                  mark();
                  opened(self);
                },
                onUpdate: opened,
              },
            });
            tl.fromTo(
              fig,
              { clipPath: slot },
              { clipPath: () => `inset(0% 0% 0% 0% round ${css("--r-xl")}px)`, ease: "power2.inOut", duration: 1 },
              0,
            )
              .fromTo([a, oa], { x: 0 }, { x: shiftA, ease: "power2.inOut", duration: 0.9 }, 0)
              .fromTo([b, ob], { x: 0 }, { x: shiftB, ease: "power2.inOut", duration: 0.9 }, 0)
              .fromTo(video, { scale: 1.35 }, { scale: 1, ease: "power2.out", duration: 1 }, 0)
              .fromTo(fade, { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.25 }, 0.05)
              .to(guides, { opacity: 0, ease: "none", duration: 0.4 }, 0.1)
              // Once the film fills the stage, its title copy steps aside so the footage plays clean.
              .to(over, { opacity: 0, ease: "power1.out", duration: 0.15 }, 0.6)
              .fromTo(cap, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 }, 0.85)
              .to({}, { duration: 0.2 });
            mark();

            // The construction lines draw in around the title as the stage arrives.
            gsap.fromTo(
              guides,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "power3.inOut",
                duration: 1.2,
                stagger: 0.08,
                scrollTrigger: { trigger: track, start: "top 75%", toggleActions: "play none none reverse" },
              },
            );

            return () => stage.style.removeProperty("--cut");
          }),
        );

        // Phones and small tablets: no pin; the film opens from its slot as it scrolls in.
        mm.add(NARROW, (ctx) =>
          later(ctx, () => {
            gsap.fromTo(
              screen,
              { clipPath: "inset(18% 46% 18% 46% round 14px)" },
              {
                clipPath: () => `inset(0% 0% 0% 0% round ${css("--r-lg")}px)`,
                ease: "power2.inOut",
                scrollTrigger: {
                  trigger: screen,
                  start: "top 92%",
                  end: "center 55%",
                  scrub: true,
                  invalidateOnRefresh: true,
                  onRefresh: (self) => setOpen(self.progress >= OPEN_AT_NARROW),
                  onUpdate: (self) => setOpen(self.progress >= OPEN_AT_NARROW, self.direction >= 0),
                },
              },
            );
            gsap.fromTo(video, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: screen, start: "top bottom", end: "bottom 40%", scrub: true } });
          }),
        );
      });

      // Measured distances depend on the display face.
      document.fonts.ready.then(build);

      return () => {
        alive = false;
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.film} aria-labelledby="film-title">
      {/* data-hide-head: the fixed header slides away while the film scene is on screen. */}
      <div className={s.track} data-track data-hide-head>
        <div className={s.stage} data-stage>
          <Reg className={s.regTL} />
          <Reg className={s.regTR} />
          <Reg className={s.regBL} />
          <Reg className={s.regBR} />

          <div className={s.metaRow}>
            <p className={`${s.tag} sec-tag mono`}>Identidad</p>
            <dl className={`${s.meta} mono`}>
              <div>
                <dt>Pieza</dt>
                <dd>Película de identidad</dd>
              </div>
              <div>
                <dt>Duración</dt>
                <dd>{clock(Math.ceil(duration))}</dd>
              </div>
            </dl>
          </div>

          {/* Construction drawing around the title, after the logo's own grid in the film. */}
          <div className={s.guides} aria-hidden="true">
            <span className={s.rule} data-guide />
            <span className={s.box} data-guide>
              <i className={`${s.ring} ${s.ringL1}`} />
              <i className={`${s.ring} ${s.ringL2}`} />
              <i className={`${s.ring} ${s.ringR1}`} />
              <i className={`${s.ring} ${s.ringR2}`} />
              <i className={`${s.ring} ${s.ringT}`} />
              <i className={`${s.ring} ${s.ringB}`} />
            </span>
            <span className={s.axis} />
          </div>

          <h2 id="film-title" className={s.title} data-title>
            <TitleText />
          </h2>

          <span className={`note ${s.note}`} data-fade aria-hidden="true">
            trazo por trazo
          </span>
          <p className={`${s.hint} mono`} data-fade aria-hidden="true">
            <span className={s.hintBar} /> Desliza para abrir
          </p>

          <figure className={s.fig} data-fig>
            <div className={s.screen} data-screen>
              {/* Wide screens get the original film; phones and small tablets a 960×540 encode of
                  the same cut (6.8 MB instead of 19.5 MB). Nothing loads until it's needed. */}
              <video
                ref={videoRef}
                className={s.video}
                poster="/intro-poster.jpg"
                muted
                loop
                playsInline
                preload="none"
                aria-label="Película de identidad de The Lab"
                aria-describedby="film-desc"
              >
                <source src="/intro.mp4" type="video/mp4" media={WIDE} />
                <source src="/intro-540.mp4" type="video/mp4" />
              </video>
              <div className={s.over} data-over aria-hidden="true">
                <p className={s.title}>
                  <TitleText />
                </p>
              </div>
            </div>
            {/* The film has no sound; this is its text alternative (WCAG 1.2.1). */}
            <p id="film-desc" className="sr-only">
              Película sin sonido, de 48 segundos. Abre con el logo de The Lab sobre papel y el título «
              <span lang="en">Demo reel</span>». Siguen «<span lang="en">What we do</span>», con un collage de fotos,
              y «<span lang="en">From Saltillo</span>», marcado con plumón rojo sobre un mapa. Después, cortes de su
              trabajo: un rodeo de noche, una mujer a caballo, vaqueros en una camioneta Chevrolet, una pickup roja,
              una bebida helada de Zoco Brema, un martini sobre fondo magenta, publicaciones para redes, una cocina,
              mejillones, una cava, Saltillo desde el aire, una obra y un tráiler en carretera. Cierra con «
              <span lang="en">Creative worth</span>» sobre barras de color y el logo.
            </p>
            <figcaption className={`${s.cap} mono`} data-cap>
              <span className={s.capDot} aria-hidden="true" />
              Película de identidad The Lab®, desde Saltillo
            </figcaption>
          </figure>

          <div className={s.ctrl}>
            <p className={`chip ${s.clock}`} aria-hidden="true">
              <span className="chip-k">{playing ? "Película" : "En pausa"}</span>
              <span className="chip-v">
                {clock(time)} / {clock(Math.ceil(duration))}
              </span>
            </p>
            <button
              type="button"
              className={s.play}
              onClick={toggle}
              aria-label={playing ? "Pausar video" : "Reproducir video"}
            >
              {playing ? (
                <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <rect x="5" y="4" width="3.4" height="12" />
                  <rect x="11.6" y="4" width="3.4" height="12" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <path d="M6.5 3.8 16 10l-9.5 6.2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
