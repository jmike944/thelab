"use client";

import * as React from "react";
import { Sun, Moon, Monitor, Send } from "lucide-react";

/* =========================================================================
 * DATA — real content from the "Creative Worth" portfolio (The Lab MX)
 * ========================================================================= */
type Project = {
  id: string;
  title: string;
  client: string;
  cat: string;
  year: string;
  bg: string;
  img: string;
  blurb: string;
};

const PROJECTS: Project[] = [
  { id: "wu",      title: "WU",      client: "WU",                       cat: "Contenido viral", year: "2026", bg: "var(--spectrum-red)",     img: "/work/wu.jpg",      blurb: "Video viral «3 vitaminas para mujeres este 2026». +25M de reproducciones y 444K likes — 100% orgánico." },
  { id: "zoco",    title: "ZOCO",    client: "Zoco Brema",               cat: "Storytelling",    year: "2026", bg: "var(--spectrum-magenta)", img: "/work/zoco.jpg",    blurb: "Spring menu para Zoco Brema: mango sticky rice matcha, banana latte y mango spritz. Storytelling que se siente, se entiende y se queda." },
  { id: "collab",  title: "COLLAB",  client: "La Cantina × La Potranca", cat: "Collabs",         year: "2025", bg: "#231f20",                 img: "/work/collab.jpg",  blurb: "Colaboración de marcas: La Cantina × La Potranca. Narrativa norteña — rancho, cantina y carretera." },
  { id: "mercato", title: "MERCATO", client: "Il Mercato Gentiloni",     cat: "Producción",      year: "2025", bg: "var(--spectrum-orange)",  img: "/work/mercato.jpg", blurb: "Sesiones fotográficas y producción de video para Il Mercato Gentiloni: carta, platillos y marca." },
  { id: "apertura",title: "EVENTOS", client: "Apertura de sucursal",     cat: "Cobertura",       year: "2026", bg: "var(--spectrum-blue)",    img: "/work/apertura.jpg",blurb: "Cobertura de apertura de nueva sucursal — shorts y reels capturados y publicados en tiempo real." },
  { id: "rancho",  title: "RANCHO",  client: "Saltillo es uto rancho",   cat: "Campañas",        year: "2025", bg: "var(--spectrum-green)",   img: "/work/rancho.jpg",  blurb: "Campaña lifestyle «Saltillo es uto rancho» — rodeo, rancho y merch para una comunidad local." },
];

const CATS = ["Todos", "Contenido viral", "Storytelling", "Collabs", "Producción", "Cobertura", "Campañas"];

const STATS = [
  { n: "+43M", l: "Visualizaciones" },
  { n: "+160K", l: "Seguidores nuevos" },
  { n: "+900K", l: "Interacciones" },
  { n: "100%", l: "Orgánico" },
];

const SVCS: [string, string][] = [
  ["Contenido viral", "Reels y shorts pensados para volverse virales. Crecimiento real, 100% orgánico."],
  ["Cobertura de eventos", "Aperturas, activaciones y experiencias cubiertas y publicadas en tiempo real."],
  ["Producción de video", "Sesiones fotográficas y video para tu carta, tu producto y tu marca."],
  ["Community management", "Manejamos tus redes y tu comunidad — la voz de tu marca, todos los días."],
];

const INTERESTS = ["Contenido viral", "Eventos", "Fotografía", "Video", "Community", "Aún no sé"];

const MARQUEE = ["CONTENIDO VIRAL", "EVENTOS", "FOTOGRAFÍA", "VIDEO", "COMMUNITY", "STORYTELLING", "CAMPAÑAS", "CREATIVE WORTH"];

const NAV: [string, string][] = [["01", "TRABAJO"], ["02", "SERVICIOS"], ["03", "ESTUDIO"], ["04", "CONTACTO"]];

const MARK = "/logos/the-lab-mark.svg";
const COMPLETE = "/logos/the-lab-complete.svg";
const MARK_3D = "/logos/the-lab-3d-line.svg";
const WORDMARK = "/logos/the-lab-wordmark.svg";

// Logos the hero plate flashes through. `tone` = single-tone (recolor per
// theme); the 3D mark is two-tone and stays as-is.
const HERO_MARKS = [
  { src: "/logos/the-lab-3d-line.svg",   fig: "FIG.01 — MARCA 3D",   tone: false },
  { src: "/logos/the-lab-mark.svg",      fig: "FIG.02 — MONOGRAMA",  tone: true },
  { src: "/logos/the-lab-complete.svg",  fig: "FIG.03 — LOCKUP",     tone: true },
  { src: "/logos/the-lab-variant.svg",   fig: "FIG.04 — VARIANTE",   tone: true },
  { src: "/logos/the-lab-variant-2.svg", fig: "FIG.05 — VARIANTE 02", tone: true },
  { src: "/logos/the-lab-wordmark.svg",  fig: "FIG.06 — WORDMARK",   tone: true },
];

/* =========================================================================
 * PRIMITIVES
 * ========================================================================= */
const SPECTRUM = ["red", "orange", "yellow", "green", "cyan", "blue", "magenta"];

function SpectrumBar({
  orientation,
  size,
  style,
}: {
  orientation?: "vertical";
  size?: "sm" | "lg";
  style?: React.CSSProperties;
}) {
  const cls = [
    "specbar",
    orientation === "vertical" ? "specbar--vertical" : "",
    size === "sm" ? "specbar--sm" : "",
    size === "lg" ? "specbar--lg" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} style={style} role="presentation" aria-hidden="true">
      {SPECTRUM.map((c) => (
        <i key={c} style={{ background: `var(--spectrum-${c})` }} />
      ))}
    </span>
  );
}

function StatusPip({
  color = "green",
  pulse,
  hollow,
  label,
  style,
}: {
  color?: string;
  pulse?: boolean;
  hollow?: boolean;
  label?: string;
  style?: React.CSSProperties;
}) {
  const dot = (
    <span
      className={["pip", pulse ? "pip--pulse" : "", hollow ? "pip--hollow" : ""].filter(Boolean).join(" ")}
      style={hollow ? undefined : { background: `var(--spectrum-${color})` }}
    />
  );
  if (!label) return <span className="pip-wrap" style={style}>{dot}</span>;
  return (
    <span className="pip-wrap" style={style}>
      {dot}
      <span className="pip-label">{label}</span>
    </span>
  );
}

function HudPanel({
  title,
  code,
  spine,
  children,
}: {
  title: string;
  code?: string;
  spine?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={"hpanel hpanel--brackets" + (spine ? " hpanel--spine" : "")}>
      {spine && (
        <span className="hpanel__spine" aria-hidden="true">
          {SPECTRUM.map((c) => (
            <i key={c} style={{ background: `var(--spectrum-${c})` }} />
          ))}
        </span>
      )}
      <div className="hpanel__hd">
        <span className="hpanel__title">{title}</span>
        {code && <span className="hpanel__code">{code}</span>}
      </div>
      <div className="hpanel__bd">{children}</div>
    </section>
  );
}

/* =========================================================================
 * HOOKS
 * ========================================================================= */
type Mode = "paper" | "signal" | "system";

function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function resolveTheme(mode: Mode): "signal" | "paper" {
  if (mode === "system") return prefersDark() ? "signal" : "paper";
  return mode;
}
function readMode(): Mode {
  try {
    const m = localStorage.getItem("lab-site-theme");
    if (m === "signal" || m === "paper" || m === "system") return m;
  } catch {}
  return "system";
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

/* =========================================================================
 * APP
 * ========================================================================= */
export default function App() {
  const [active, setActive] = React.useState("TRABAJO");
  const [mode, setMode] = React.useState<Mode>("system");
  const [theme, setTheme] = React.useState<"signal" | "paper">("paper");
  const [coord, setCoord] = React.useState("25.421N 101.001W");
  const [open, setOpen] = React.useState<Project | null>(null);
  const [sent, setSent] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const [saver, setSaver] = React.useState(false);
  const enteredRef = React.useRef(false);
  const enter = React.useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setFlash(true); // test-card flash...
    setEntered(true); // ...hides the video + reveals the site beneath
    window.setTimeout(() => setFlash(false), 430); // then cut abruptly
  }, []);

  // Hold on the intro (scroll locked) until the slightest scroll / swipe / key,
  // then flash the test card and reveal the site.
  React.useEffect(() => {
    if (entered) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const onIntent = () => enter();
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Enter"].includes(e.key)) enter();
    };
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchmove", onIntent, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchmove", onIntent);
      window.removeEventListener("keydown", onKey);
    };
  }, [entered, enter]);

  // DVD-style screensaver after 10s idle (only once the site is revealed).
  React.useEffect(() => {
    if (!entered) return;
    let timer: number | undefined;
    const reset = () => {
      setSaver(false);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setSaver(true), 10000);
    };
    const evs = ["mousemove", "mousedown", "keydown", "wheel", "touchstart", "scroll"];
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      if (timer) window.clearTimeout(timer);
      evs.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [entered]);

  React.useEffect(() => {
    const m = readMode();
    setMode(m);
    setTheme(resolveTheme(m));
  }, []);

  // When following the OS, repaint live as the system scheme changes.
  React.useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = mq.matches ? "signal" : "paper";
      setTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved === "signal" ? "signal" : "");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  function applyMode(next: Mode) {
    setMode(next);
    const resolved = resolveTheme(next);
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved === "signal" ? "signal" : "");
    try {
      localStorage.setItem("lab-site-theme", next);
    } catch {}
  }
  function nav(id: string) {
    setActive(id);
    scrollToId(id === "top" ? "top" : id);
  }
  const start = () => {
    setActive("CONTACTO");
    scrollToId("CONTACTO");
  };

  React.useEffect(() => {
    const t = setInterval(() => {
      const a = (25.42 + (Math.random() * 0.01 - 0.005)).toFixed(3);
      const b = (101.0 + (Math.random() * 0.01 - 0.005)).toFixed(3);
      setCoord(`${a}N ${b}W`);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <>
      <LabIntro entered={entered} onEnter={enter} />
      {flash && <LabFlash />}
      <div className={"ls-scan" + (entered ? "" : " ls-hidden")} aria-hidden="true" />
      <LabHeader active={active} onNav={nav} onStart={start} mode={mode} onSetMode={applyMode} hidden={!entered} />
      <LabRailLeft coord={coord} mode={mode} onSetMode={applyMode} hidden={!entered} />
      <LabRailRight hidden={!entered} />
      <main className="ls-main">
        <LabHero onStart={start} onWork={() => nav("TRABAJO")} />
        <LabMarquee items={MARQUEE} />
        <LabWork onOpen={setOpen} />
        <LabStudio />
        <LabContact sent={sent} onSend={() => setSent(true)} />
      </main>
      <LabFooter />
      {open && <CaseModal p={open} onClose={() => setOpen(null)} />}
      {saver && <Screensaver />}
    </>
  );
}

/* =========================================================================
 * SCREENSAVER — DVD-style bouncing logo that recolors on each wall hit
 * ========================================================================= */
function Screensaver() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const colors = SPECTRUM;
    let ci = 0;
    let vx = 2.4;
    let vy = 1.9;
    const w = el.offsetWidth || 240;
    const h = el.offsetHeight || 80;
    let x = 48;
    let y = 48;
    el.style.backgroundColor = `var(--spectrum-${colors[ci]})`;
    let raf = 0;
    const step = () => {
      const maxX = Math.max(0, window.innerWidth - w);
      const maxY = Math.max(0, window.innerHeight - h);
      x += vx;
      y += vy;
      let hit = false;
      if (x <= 0) { x = 0; vx = Math.abs(vx); hit = true; }
      else if (x >= maxX) { x = maxX; vx = -Math.abs(vx); hit = true; }
      if (y <= 0) { y = 0; vy = Math.abs(vy); hit = true; }
      else if (y >= maxY) { y = maxY; vy = -Math.abs(vy); hit = true; }
      if (hit) {
        ci = (ci + 1) % colors.length;
        el.style.backgroundColor = `var(--spectrum-${colors[ci]})`;
      }
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="ls-saver" aria-hidden="true">
      <div ref={ref} className="ls-saver__logo" />
      <span className="ls-saver__tag">SYS.IDLE // MUEVE PARA DESPERTAR</span>
    </div>
  );
}

/* =========================================================================
 * INTRO — full-screen muted autoplay video; scroll down to reveal the site
 * ========================================================================= */
function LabIntro({ entered, onEnter }: { entered: boolean; onEnter: () => void }) {
  const vref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const v = vref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, []);
  return (
    <section
      className={"ls-intro" + (entered ? " is-entered" : "")}
      aria-label="Intro"
      onClick={onEnter}
    >
      <video
        ref={vref}
        className="ls-intro__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/intro-poster.jpg"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="ls-intro__veil" aria-hidden="true" />
      <div className="ls-intro__cue" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ls-intro__mark" src="/logos/the-lab-wordmark.svg" alt="" />
        <span className="ls-intro__scroll">
          DESLIZA
          <span className="ls-intro__chev">↓</span>
        </span>
      </div>
    </section>
  );
}

/* Broadcast test-card flash shown on enter, then cut abruptly to the site. */
function LabFlash() {
  const ramp = ["#000000", "#2b2b2b", "#555555", "#808080", "#aaaaaa", "#d6d6d6", "#ffffff"];
  return (
    <div className="ls-flash" aria-hidden="true">
      <div className="ls-flash__bars">
        {SPECTRUM.map((c) => (
          <i key={c} style={{ background: `var(--spectrum-${c})` }} />
        ))}
      </div>
      <div className="ls-flash__ramp">
        {ramp.map((g) => (
          <i key={g} style={{ background: g }} />
        ))}
      </div>
      <div className="ls-flash__base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ls-flash__mark" src="/logos/the-lab-wordmark.svg" alt="" />
        <span className="ls-flash__tag">// SIGNAL — THE LAB® — CREATIVE WORTH</span>
      </div>
    </div>
  );
}

/* =========================================================================
 * HEADER + RAILS
 * ========================================================================= */
function LabHeader({
  active,
  onNav,
  onStart,
  mode,
  onSetMode,
  hidden,
}: {
  active: string;
  onNav: (id: string) => void;
  onStart: () => void;
  mode: Mode;
  onSetMode: (m: Mode) => void;
  hidden?: boolean;
}) {
  return (
    <nav className={"ls-nav" + (hidden ? " ls-hidden-top" : "")}>
      <a
        className="ls-brand"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onNav("top");
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={COMPLETE} alt="The Lab — Creative Worth" className="ls-mark" />
      </a>
      <div className="ls-links">
        {NAV.map(([n, l]) => (
          <button
            key={l}
            type="button"
            onClick={() => onNav(l)}
            className={"ls-link" + (active === l ? " is-active" : "")}
          >
            <span className="ls-link__n">{n}.</span>
            {l}
          </button>
        ))}
      </div>
      <div className="ls-nav__right">
        <div className="ls-toggle" role="group" aria-label="Modo de pantalla">
          <button
            type="button"
            aria-label="Papel"
            title="Papel"
            aria-pressed={mode === "paper"}
            className={"ls-toggle__opt" + (mode === "paper" ? " is-on" : "")}
            onClick={() => onSetMode("paper")}
          >
            <Sun size={14} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Digital"
            title="Digital"
            aria-pressed={mode === "signal"}
            className={"ls-toggle__opt" + (mode === "signal" ? " is-on" : "")}
            onClick={() => onSetMode("signal")}
          >
            <Moon size={14} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Sistema"
            title="Sistema"
            aria-pressed={mode === "system"}
            className={"ls-toggle__opt" + (mode === "system" ? " is-on" : "")}
            onClick={() => onSetMode("system")}
          >
            <Monitor size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <button className="ls-cta" onClick={onStart} aria-label="Empezar un proyecto">
          <span className="ls-cta__label">
            EMPEZAR PROYECTO<span className="ls-cta__arr">→</span>
          </span>
          <Send size={15} strokeWidth={2} className="ls-cta__icon" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

function LabRailLeft({
  coord,
  mode,
  onSetMode,
  hidden,
}: {
  coord: string;
  mode: Mode;
  onSetMode: (m: Mode) => void;
  hidden?: boolean;
}) {
  const modes: [Mode, string, string][] = [
    ["paper", "PAP", "Papel"],
    ["signal", "DIG", "Digital"],
    ["system", "SYS", "Sistema"],
  ];
  return (
    <aside className={"ls-rail ls-rail--l" + (hidden ? " ls-hidden" : "")}>
      <span className="ls-rail__txt">SYS.ON // EN LÍNEA</span>
      <div className="ls-rail__mid">
        <div className="ls-rail__pips">
          <StatusPip color="green" pulse />
          <StatusPip hollow />
          <StatusPip hollow />
        </div>
        <div className="ls-rail__mode" role="group" aria-label="Modo de pantalla">
          <span className="ls-rail__modelbl">DSP</span>
          {modes.map(([m, abbr, label]) => (
            <button
              key={m}
              type="button"
              title={label}
              aria-pressed={mode === m}
              className={"ls-rail__modebtn" + (mode === m ? " is-on" : "")}
              onClick={() => onSetMode(m)}
            >
              {abbr}
            </button>
          ))}
        </div>
      </div>
      <span className="ls-rail__txt">{coord}</span>
    </aside>
  );
}

function LabRailRight({ hidden }: { hidden?: boolean }) {
  return (
    <aside className={"ls-rail ls-rail--r" + (hidden ? " ls-hidden" : "")}>
      <div style={{ width: "100%", padding: "0 8px" }}>
        <SpectrumBar orientation="vertical" size="lg" style={{ height: "64px", margin: "0 auto" }} />
      </div>
      <span className="ls-rail__txt">FREQ: 144.20 MHz</span>
    </aside>
  );
}

function LabMarquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="ls-marq" aria-hidden="true">
      <div className="ls-marq__track">
        {row.map((t, i) => (
          <span key={i} className="ls-marq__item">
            {t}
            <span className="ls-marq__sep">／</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
 * HERO
 * ========================================================================= */
function LabHero({ onStart, onWork }: { onStart: () => void; onWork: () => void }) {
  const [idx, setIdx] = React.useState(0);
  const [flicker, setFlicker] = React.useState(false);
  const prevRef = React.useRef(0);
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => {
      setIdx((i) => {
        prevRef.current = i;
        return (i + 1) % HERO_MARKS.length;
      });
      if (!reduce) {
        setFlicker(true);
        window.setTimeout(() => setFlicker(false), 360);
      }
    }, reduce ? 2600 : 1600);
    return () => window.clearInterval(id);
  }, []);
  const m = HERO_MARKS[idx];
  const prev = HERO_MARKS[prevRef.current];
  return (
    <section className="lb-hero ls-brk" id="top">
      <div className="lb-monitor">
        <span>// PANTALLA PRINCIPAL</span>
        <span>THE LAB® — CREATIVE WORTH</span>
        <span>FPS: 60.0</span>
      </div>
      <div className="lb-hero__grid">
        <div className="lb-hero__copy">
          <div className="lb-eyebrow">&gt;&gt; ESTUDIO CREATIVO — SALTILLO, COAHUILA · MX</div>
          <h1 className="lb-hero__title">
            Creative
            <br />
            worth<span className="lb-dot">.</span>
          </h1>
          <p className="lb-hero__sub">
            Conectamos con tu marca para convertir lo que eres en contenido que se siente, se entiende y se queda.
          </p>
          <div className="lb-hero__cta">
            <button className="ls-cta ls-cta--lg" onClick={onStart}>
              EMPEZAR UN PROYECTO <span className="ls-cta__arr">→</span>
            </button>
            <button className="ls-btn-ghost" onClick={onWork}>
              VER EL TRABAJO
            </button>
          </div>
        </div>
        <div className="lb-hero__panel">
          <div className="lb-hero__rec">
            <StatusPip color="red" pulse label="REC [CH.01]" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={idx}
            className={"lb-hero__mark lb-hero__mark--in" + (m.tone ? " is-tone" : "")}
            src={m.src}
            alt="The Lab"
          />
          {flicker && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={"g" + idx}
                className={"lb-hero__mark lb-hero__ghost" + (prev.tone ? " is-tone" : "")}
                src={prev.src}
                alt=""
                aria-hidden="true"
              />
            </>
          )}
          <div className="lb-hero__plate">
            <span className="lb-code">{m.fig}</span>
          </div>
          <span className="lb-hero__scan" aria-hidden="true" />
        </div>
      </div>
      <SpectrumBar style={{ marginTop: "24px" }} />
    </section>
  );
}

/* =========================================================================
 * WORK
 * ========================================================================= */
function LabWorkTile({ p, onOpen }: { p: Project; onOpen: (p: Project) => void }) {
  return (
    <button type="button" className="lb-card" onClick={() => onOpen(p)}>
      <div className="lb-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lb-card__img" src={p.img} alt={p.client} loading="lazy" />
        <span className="lb-card__bar" style={{ background: p.bg }} />
        <span className="lb-card__scrim" />
        <span className="lb-card__title">{p.title}</span>
      </div>
      <div className="lb-card__body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{p.client}</span>
          <span className="lb-badge">{p.year}</span>
        </div>
        <span
          style={{
            fontSize: 13,
            color: "var(--hud-muted)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            fontWeight: 700,
          }}
        >
          {p.cat}
        </span>
      </div>
    </button>
  );
}

function LabWork({ onOpen }: { onOpen: (p: Project) => void }) {
  const [cat, setCat] = React.useState("Todos");
  const shown = cat === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat);
  return (
    <section className="lb-sec" id="TRABAJO">
      <div className="lb-workhead">
        <div>
          <div className="lb-eyebrow" style={{ color: "var(--hud-muted)", marginBottom: "8px" }}>
            TRABAJO SELECCIONADO // SEC_01
          </div>
          <h2 className="lb-worktitle">
            Hecho en the lab<span className="lb-dot">.</span>
          </h2>
        </div>
        <div className="lb-pills">
          {CATS.map((c) => (
            <button key={c} type="button" className="lb-tag" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="lb-tiles">
        {shown.map((p) => (
          <LabWorkTile key={p.id} p={p} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
 * STUDIO
 * ========================================================================= */
function LabStudio() {
  return (
    <section className="lb-sec" id="ESTUDIO">
      <div className="lb-sechead">
        <span className="lb-code">SEC_03 // EL ESTUDIO</span>
        <SpectrumBar size="sm" style={{ flex: 1, opacity: 0.6 }} />
      </div>
      <div className="lb-studio2">
        <div>
          <div className="lb-eyebrow" style={{ marginBottom: "14px" }}>
            EL ESTUDIO
          </div>
          <h2 className="lb-h2">Especialistas en restaurantes y experiencias.</h2>
          <p className="lb-body">
            The Lab es un estudio de contenido en Saltillo, Coahuila. Creamos contenido viral, fotografía, video y
            community management para marcas que quieren rango — crecimiento real, hecho 100% orgánico. Convertimos lo
            que eres en contenido que se siente, se entiende y se queda.
          </p>
          <div className="lb-crew">
            <span className="lb-tag" aria-hidden="true">
              RESTAURANTES Y EXPERIENCIAS
            </span>
            <span className="lb-crew__cap">Saltillo, Coahuila · México — @thelab.mx</span>
          </div>
        </div>
        <div className="lb-statbox ls-brk-sm">
          {STATS.map((s, i) => (
            <div
              key={s.l}
              className="lb-statcell"
              style={{
                borderRight: i % 2 === 0 ? "1px solid var(--hud-line)" : "none",
                borderBottom: i < 2 ? "1px solid var(--hud-line)" : "none",
              }}
            >
              <div className="lb-statcell__n">{s.n}</div>
              <div className="lb-statcell__l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="lb-svc" id="SERVICIOS">
        {SVCS.map(([h, d], i) => (
          <div key={h} className="lb-svc__cell" style={{ borderRight: i < 3 ? "1px solid var(--hud-line)" : "none" }}>
            <div className="lb-svc__n">0{i + 1}</div>
            <h3 className="lb-svc__h">{h}</h3>
            <p className="lb-svc__d">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
 * CONTACT
 * ========================================================================= */
function LabContact({ sent, onSend }: { sent: boolean; onSend: () => void }) {
  const [pick, setPick] = React.useState<string[]>([]);
  const toggle = (x: string) => setPick((p) => (p.includes(x) ? p.filter((i) => i !== x) : [...p, x]));
  return (
    <section className="lb-sec" id="CONTACTO">
      <HudPanel title="TRANSMITIR // EMPIEZA UN PROYECTO" code="SEC_04" spine>
        {sent ? (
          <div className="lb-sent">
            <StatusPip color="green" pulse label="SEÑAL RECIBIDA" />
            <h2 className="lb-h2" style={{ marginTop: "12px" }}>
              Transmisión registrada.
            </h2>
            <p className="lb-body">
              Te respondemos en menos de 2 días hábiles. Frecuencia fijada.
            </p>
          </div>
        ) : (
          <div className="lb-contact2">
            <div className="lb-form">
              <div className="lb-form__row">
                <label>
                  <span className="lb-field__lbl">Nombre</span>
                  <input className="lb-input" placeholder="Tu nombre" />
                </label>
                <label>
                  <span className="lb-field__lbl">Email</span>
                  <input className="lb-input" type="email" placeholder="tu@correo.com" />
                </label>
              </div>
              <div className="lb-field">
                <span className="lb-field__lbl">Interesado en</span>
                <div className="lb-chips">
                  {INTERESTS.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className={"lb-chip" + (pick.includes(x) ? " is-on" : "")}
                      onClick={() => toggle(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
              <label>
                <span className="lb-field__lbl">El brief</span>
                <textarea className="lb-textarea" rows={3} placeholder="¿Qué vamos a crear?" />
              </label>
              <button className="ls-cta ls-cta--lg" onClick={onSend} style={{ alignSelf: "flex-start" }}>
                TRANSMITIR BRIEF <span className="ls-cta__arr">→</span>
              </button>
            </div>
            <aside className="lb-coord">
              <div className="lb-coord__row">
                <span className="lb-coord__k">Estudio</span>
                <span className="lb-coord__v">vasconcelos@thelabmx.com</span>
              </div>
              <div className="lb-coord__row">
                <span className="lb-coord__k">Ubicación</span>
                <span className="lb-coord__v">Saltillo, Coahuila · MX</span>
              </div>
              <div className="lb-coord__row">
                <span className="lb-coord__k">Instagram</span>
                <span className="lb-coord__v">@thelab.mx</span>
              </div>
              <div className="lb-coord__row">
                <span className="lb-coord__k">Respuesta</span>
                <span className="lb-coord__v">&le; 2 días hábiles</span>
              </div>
              <div className="lb-coord__status">
                <StatusPip color="green" pulse label="LÍNEA ABIERTA" />
              </div>
              <SpectrumBar size="sm" style={{ marginTop: "auto" }} />
            </aside>
          </div>
        )}
      </HudPanel>
    </section>
  );
}

/* =========================================================================
 * FOOTER
 * ========================================================================= */
function LabFooter() {
  return (
    <footer className="ls-footer" id="footer">
      <div className="ls-rndr">
        <span className="ls-rndr__lbl">IMG.RNDR_V1</span>
        <span className="ls-rndr__line" />
        <div className="ls-rndr__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={WORDMARK} alt="THE LAB" className="ls-rndr__img" />
          <span className="ls-rndr__scan" aria-hidden="true" />
        </div>
        <span className="ls-rndr__line" />
        <span className="ls-rndr__lbl ls-rndr__lbl--r">OK</span>
      </div>
      <SpectrumBar />
      <div className="ls-footer__bar">
        <StatusPip color="green" label="SISTEMA: NOMINAL" />
        <span className="ls-footer__c">©2026 THE LAB® — FIN DE TRANSMISIÓN · SALTILLO, MX</span>
      </div>
    </footer>
  );
}

/* =========================================================================
 * CASE MODAL
 * ========================================================================= */
function CaseModal({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="lb-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="lb-modal__hd">
          <span className="lb-modal__title">
            // {p.id} · {p.title}
          </span>
          <button className="lb-modal__x" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="lb-modal__hero" style={{ padding: 0, overflow: "hidden", display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.img} alt={p.client} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <SpectrumBar />
        <div className="lb-modal__bd">
          <div className="lb-code" style={{ marginBottom: "10px" }}>
            {p.cat} · {p.year}
          </div>
          <h2 className="lb-h2" style={{ fontSize: "32px" }}>
            {p.client}
          </h2>
          <p className="lb-body" style={{ maxWidth: "none" }}>
            {p.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}
