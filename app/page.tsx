"use client";

import * as React from "react";
import { Send, SlidersHorizontal } from "lucide-react";
import {
  buildImageTransitionSnapshot,
  buildPosterSticker,
  buildStickerStack,
  buildStickerTransitionSnapshot,
  transitionOverlayForTheme,
} from "@/lib/sticker-screensaver.mjs";

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

// Servicios is part of the Estudio section, so the nav treats them as one.
const NAV: [string, string][] = [["01", "TRABAJO"], ["02", "ESTUDIO"], ["03", "CONTACTO"]];

// Accent pairs: a DARK brand colour for Papel (legible on the light background)
// twinned with a BRIGHT one for Digital (legible on the dark background). The
// accent swaps between the two as the theme changes, so it's always readable.
// Default is blue ↔ yellow.
const ACCENT_PAIRS: { key: string; paper: string; digital: string }[] = [
  { key: "blue", paper: "#3537ff", digital: "#feff1f" }, // blue ↔ yellow
  { key: "magenta", paper: "#ff0074", digital: "#00cfff" }, // magenta ↔ cyan
  { key: "red", paper: "#ee1708", digital: "#3ac62f" }, // red ↔ green
  { key: "violet", paper: "#8a00ff", digital: "#ff9000" }, // violet ↔ orange
];
function accentColor(key: string, dark: boolean) {
  const p = ACCENT_PAIRS.find((x) => x.key === key) ?? ACCENT_PAIRS[0];
  return dark ? p.digital : p.paper;
}
function applyAccentVars(key: string, dark: boolean) {
  const r = document.documentElement;
  r.style.setProperty("--hud-accent", accentColor(key, dark));
  r.style.setProperty("--hud-accent-ink", dark ? "#231f20" : "#fffcf7");
}

const MARK = "/logos/the-lab-mark.svg";
const COMPLETE = "/logos/the-lab-complete.svg";
const MARK_3D = "/logos/the-lab-3d-line.svg";
const WORDMARK = "/logos/the-lab-wordmark.svg";

// Single-tone logos the header brand cycles through on click — the theme
// filter inverts these cleanly (the colour 3D marks are excluded).
const HEADER_LOGOS = [COMPLETE, MARK, "/logos/the-lab-variant.svg", "/logos/the-lab-variant-2.svg", WORDMARK];

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
const SPECTRUM = ["red", "orange", "yellow", "green", "cyan", "blue", "violet", "magenta"];

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
type StickerSnapshot = ReturnType<typeof buildStickerStack>;
type CrumpleSnapshot =
  | { kind: "stickers"; stickers: StickerSnapshot }
  | { kind: "image"; src: string };

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
  const [flash, setFlash] = React.useState<"testcard" | "paperCrumple" | null>(null);
  const [crumpleSnapshot, setCrumpleSnapshot] = React.useState<CrumpleSnapshot>(() => ({
    kind: "stickers",
    stickers: buildStickerStack(30),
  }));
  const [saver, setSaver] = React.useState(false);
  const [accent, setAccent] = React.useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const enteredRef = React.useRef(false);

  // Accent: the pre-paint script already applied the saved pair; sync state for
  // the picker UI. A ref keeps the current pair available to theme listeners.
  const accentRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    accentRef.current = accent;
  }, [accent]);
  React.useEffect(() => {
    try {
      const a = localStorage.getItem("lab-site-accent");
      if (a) setAccent(a);
    } catch {}
  }, []);
  function applyAccent(key: string) {
    const dark = document.documentElement.getAttribute("data-theme") === "signal";
    if (accent === key) {
      // toggle off → back to the default pair
      setAccent(null);
      applyAccentVars("blue", dark);
      try { localStorage.removeItem("lab-site-accent"); } catch {}
      return;
    }
    setAccent(key);
    applyAccentVars(key, dark);
    try { localStorage.setItem("lab-site-accent", key); } catch {}
  }
  // Picker state: the active pair (default "blue") and each pair's colour for
  // the current theme.
  const activeAccent = accent ?? "blue";
  const accentOptions = ACCENT_PAIRS.map((p) => ({ key: p.key, color: theme === "signal" ? p.digital : p.paper }));
  const saverRef = React.useRef(false);
  const saverStickersRef = React.useRef<StickerSnapshot>(buildStickerStack(1));
  const flashTimer = React.useRef<number | undefined>(undefined);
  const triggerFlash = React.useCallback((
    phase?: "intro-exit" | "screensaver-enter" | "screensaver-exit",
    payload?: { stickers?: StickerSnapshot; imageSrc?: string },
  ) => {
    const overlay = transitionOverlayForTheme(theme, phase);
    if (!overlay) return;
    if (overlay === "paperCrumple") {
      if (payload?.imageSrc) setCrumpleSnapshot(buildImageTransitionSnapshot(payload.imageSrc) as CrumpleSnapshot);
      else setCrumpleSnapshot({ kind: "stickers", stickers: buildStickerTransitionSnapshot(payload?.stickers ?? buildStickerStack(30)) });
    }
    setFlash(overlay);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(null), 1600);
  }, [theme]);
  const enter = React.useCallback((imageSrc?: string) => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    triggerFlash("intro-exit", imageSrc ? { imageSrc } : undefined);
    setEntered(true);
  }, [triggerFlash]);

  // Hold on the intro (scroll locked) until the slightest scroll / swipe / key,
  // then flash the test card and reveal the site.
  React.useEffect(() => {
    if (entered) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [entered]);

  // DVD-style screensaver after 10s idle (only once the site is revealed).
  // A test-card flash plays both entering and exiting the screensaver.
  React.useEffect(() => {
    if (!entered) return;
    let timer: number | undefined;
    const show = () => {
      saverRef.current = true;
      setSaver(true);
      triggerFlash("screensaver-enter");
    };
    const reset = () => {
      if (saverRef.current) {
        saverRef.current = false;
        setSaver(false);
        triggerFlash("screensaver-exit", { stickers: saverStickersRef.current });
      }
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(show, 10000);
    };
    const evs = ["mousemove", "mousedown", "keydown", "wheel", "touchstart", "scroll"];
    evs.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      if (timer) window.clearTimeout(timer);
      evs.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [entered, triggerFlash]);

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
      applyAccentVars(accentRef.current ?? "blue", mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  function applyMode(next: Mode) {
    setMode(next);
    const resolved = resolveTheme(next);
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved === "signal" ? "signal" : "");
    applyAccentVars(accentRef.current ?? "blue", resolved === "signal");
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
      if (e.key === "Escape") {
        setOpen(null);
        setSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  // Scroll-spy: highlight the nav item for the section currently in view.
  // ids are in scroll order; the active section is the last one whose top has
  // passed the detection line below the header (Servicios counts as Estudio).
  React.useEffect(() => {
    if (!entered) return;
    const ids = ["TRABAJO", "ESTUDIO", "CONTACTO"];
    let raf = 0;
    const update = () => {
      raf = 0;
      // Detection line ~40% down the viewport (below the 72px header). A
      // fraction (not a fixed offset) lets the short final section activate
      // near the page bottom, where its heading can't climb to the very top.
      const line = Math.max(96, window.innerHeight * 0.4);
      let current = "top"; // hero region → nothing highlighted
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // Snap to the last section once scrolled to the very bottom.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = ids[ids.length - 1];
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [entered]);

  return (
    <>
      <LabIntro entered={entered} onEnter={enter} />
      {flash === "testcard" && <LabFlash />}
      {flash === "paperCrumple" && <LabPaperCrumpleTransition snapshot={crumpleSnapshot} />}
      <div className={"ls-scan" + (entered ? "" : " ls-hidden")} aria-hidden="true" />
      <LabHeader active={active} onNav={nav} onStart={start} onOpenSettings={() => setSettingsOpen(true)} hidden={!entered} />
      <LabRailLeft coord={coord} mode={mode} onSetMode={applyMode} hidden={!entered} />
      <LabRailRight options={accentOptions} selected={activeAccent} onAccent={applyAccent} hidden={!entered} />
      <main className="ls-main">
        <LabHero onStart={start} onWork={() => nav("TRABAJO")} />
        <LabMarquee items={MARQUEE} />
        <LabWork onOpen={setOpen} />
        <LabStudio />
        <LabContact sent={sent} onSend={() => setSent(true)} />
      </main>
      <LabFooter />
      {open && <CaseModal p={open} onClose={() => setOpen(null)} />}
      {settingsOpen && (
        <SettingsModal
          mode={mode}
          onSetMode={applyMode}
          options={accentOptions}
          selected={activeAccent}
          onAccent={applyAccent}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {saver && (theme === "signal" ? <Screensaver /> : <ScreensaverPoster onStickersChange={(stickers) => { saverStickersRef.current = stickers; }} />)}
    </>
  );
}

/* =========================================================================
 * SETTINGS MODAL (mobile) — pick theme + accent colour
 * ========================================================================= */
function SettingsModal({
  mode,
  onSetMode,
  options,
  selected,
  onAccent,
  onClose,
}: {
  mode: Mode;
  onSetMode: (m: Mode) => void;
  options: { key: string; color: string }[];
  selected: string;
  onAccent: (k: string) => void;
  onClose: () => void;
}) {
  const modes: [Mode, string][] = [
    ["paper", "Papel"],
    ["signal", "Digital"],
    ["system", "Sistema"],
  ];
  return (
    <div className="ls-set" onClick={onClose}>
      <div className="ls-set__panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Ajustes">
        <div className="ls-set__hd">
          <span className="ls-set__title">// AJUSTES</span>
          <button className="lb-modal__x" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="ls-set__bd">
          <div className="ls-set__lbl">Modo de pantalla</div>
          <div className="ls-set__modes">
            {modes.map(([m, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                className={"ls-set__mode" + (mode === m ? " is-on" : "")}
                onClick={() => onSetMode(m)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="ls-set__lbl">Color de acento</div>
          <div className="ls-set__colors">
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                title={o.key}
                aria-label={o.key}
                aria-pressed={selected === o.key}
                className={"ls-set__color" + (selected === o.key ? " is-on" : "")}
                style={{ background: o.color }}
                onClick={() => onAccent(o.key)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
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
    // Single-tone logos that recolor cleanly through the mask. Each carries its
    // own aspect ratio so the bounce box stays tight to the artwork.
    const designs = [
      { src: "/logos/the-lab-complete.svg",  ar: "10613 / 3540" },
      { src: "/logos/the-lab-mark.svg",      ar: "9159 / 4698" },
      { src: "/logos/the-lab-variant.svg",   ar: "10775 / 3594" },
      { src: "/logos/the-lab-variant-2.svg", ar: "13130 / 4286" },
      { src: "/logos/the-lab-wordmark.svg",  ar: "12506 / 2720" },
    ];
    let ci = 0;
    let di = 0;
    const applyDesign = () => {
      const d = designs[di];
      el.style.aspectRatio = d.ar;
      const m = `url(${d.src}) center / contain no-repeat`;
      el.style.setProperty("-webkit-mask", m);
      el.style.setProperty("mask", m);
    };
    applyDesign();
    el.style.backgroundColor = `var(--spectrum-${colors[ci]})`;
    let vx = 2.4;
    let vy = 1.9;
    let x = 48;
    let y = 48;
    let raf = 0;
    const step = () => {
      // Recompute size each frame — the box changes when the design swaps.
      const w = el.offsetWidth || 240;
      const h = el.offsetHeight || 80;
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
        // One full pass through every colour → swap to the next logo design.
        if (ci === 0) {
          di = (di + 1) % designs.length;
          applyDesign();
        }
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

function ScreensaverPoster({ onStickersChange }: { onStickersChange: (stickers: ReturnType<typeof buildStickerStack>) => void }) {
  const [stickers, setStickers] = React.useState(() => buildStickerStack(1));
  React.useEffect(() => {
    onStickersChange(stickers);
  }, [onStickersChange, stickers]);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setStickers((items) => [...items, buildPosterSticker(items.length)]);
    }, 720);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="ls-poster" aria-hidden="true">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="ls-poster__slot"
          style={{
            left: `${sticker.left}%`,
            top: `${sticker.top}%`,
            zIndex: sticker.zIndex,
            transform: `translate(-50%, -50%) rotate(${sticker.rotate}deg)`,
          }}
        >
          <div className="ls-poster__sticker" style={{ background: sticker.bg, width: `min(${sticker.width}px, 44vw)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={sticker.preserveTone ? "preserve-tone" : undefined} src={sticker.src} alt="" />
          </div>
        </div>
      ))}
      <span className="ls-poster__tag">SYS.IDLE // MUEVE PARA DESPERTAR</span>
    </div>
  );
}

/* =========================================================================
 * INTRO — full-screen muted autoplay video; scroll down to reveal the site
 * ========================================================================= */
function LabIntro({ entered, onEnter }: { entered: boolean; onEnter: (imageSrc?: string) => void }) {
  const vref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const v = vref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, []);
  const enterWithFrame = React.useCallback(() => {
    const v = vref.current;
    if (!v || !v.videoWidth || !v.videoHeight) {
      onEnter();
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        onEnter();
        return;
      }
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      onEnter(canvas.toDataURL("image/jpeg", 0.82));
    } catch {
      onEnter();
    }
  }, [onEnter]);
  React.useEffect(() => {
    if (entered) return;
    const onIntent = () => enterWithFrame();
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Enter"].includes(e.key)) enterWithFrame();
    };
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchmove", onIntent, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchmove", onIntent);
      window.removeEventListener("keydown", onKey);
    };
  }, [entered, enterWithFrame]);
  return (
    <section
      className={"ls-intro" + (entered ? " is-entered" : "")}
      aria-label="Intro"
      onClick={enterWithFrame}
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

function LabPaperCrumpleTransition({ snapshot }: { snapshot: CrumpleSnapshot }) {
  const panelStyle = snapshot.kind === "image"
    ? { backgroundImage: `url(${snapshot.src})` }
    : undefined;
  return (
    <div className="ls-paper-crumple" aria-hidden="true">
      <div className="ls-paper-crumple__panel" style={panelStyle}>
        {snapshot.kind === "stickers" && snapshot.stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="ls-paper-crumple__slot"
            style={{
              left: `${sticker.left}%`,
              top: `${sticker.top}%`,
              zIndex: sticker.zIndex,
              transform: `translate(-50%, -50%) rotate(${sticker.rotate}deg)`,
            }}
          >
            <div className="ls-paper-crumple__sticker" style={{ background: sticker.bg, width: `min(${sticker.width}px, 42vw)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={sticker.preserveTone ? "preserve-tone" : undefined} src={sticker.src} alt="" />
            </div>
          </div>
        ))}
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
  onOpenSettings,
  hidden,
}: {
  active: string;
  onNav: (id: string) => void;
  onStart: () => void;
  onOpenSettings: () => void;
  hidden?: boolean;
}) {
  const [logoIdx, setLogoIdx] = React.useState(0);
  // Restore the last-shown header logo on mount, and persist each change so it
  // sticks for the next visit (same pattern as the accent colour).
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("lab-site-logo");
      const i = saved ? HEADER_LOGOS.indexOf(saved) : -1;
      if (i >= 0) setLogoIdx(i);
    } catch {}
  }, []);
  const cycleLogo = () => {
    setLogoIdx((i) => {
      const next = (i + 1) % HEADER_LOGOS.length;
      try {
        localStorage.setItem("lab-site-logo", HEADER_LOGOS[next]);
      } catch {}
      return next;
    });
  };
  return (
    <nav className={"ls-nav" + (hidden ? " ls-hidden-top" : "")}>
      <button
        className="ls-brand"
        type="button"
        aria-label="Cambiar logo"
        onClick={cycleLogo}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HEADER_LOGOS[logoIdx]} alt="The Lab — Creative Worth" className="ls-mark" />
      </button>
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
        <button className="ls-settings-btn" type="button" aria-label="Ajustes" onClick={onOpenSettings}>
          <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
        </button>
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
      <div className="ls-rail__pips">
        <StatusPip color="green" pulse />
        <StatusPip hollow />
        <StatusPip hollow />
      </div>
      <span className="ls-rail__txt">{coord}</span>
    </aside>
  );
}

function LabRailRight({
  options,
  selected,
  onAccent,
  hidden,
}: {
  options: { key: string; color: string }[];
  selected: string;
  onAccent: (k: string) => void;
  hidden?: boolean;
}) {
  return (
    <aside className={"ls-rail ls-rail--r" + (hidden ? " ls-hidden" : "")}>
      <div className="ls-rail__accwrap" role="group" aria-label="Color de acento">
        <span className="ls-rail__modelbl">ACC</span>
        <div className="ls-accbar">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              title={o.key}
              aria-label={o.key}
              aria-pressed={selected === o.key}
              className={"ls-accbar__seg" + (selected === o.key ? " is-on" : "")}
              style={{ background: o.color }}
              onClick={() => onAccent(o.key)}
            />
          ))}
        </div>
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
        <div className="lb-tv">
          <div className="lb-tv__screen">
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
            <span className="lb-tv__sweep" aria-hidden="true" />
            <span className="lb-tv__scan" aria-hidden="true" />
            <span className="lb-tv__plate">{m.fig}</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lb-tv__img" src="/crt-tv.png" alt="The Lab — TV" />
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
        <span className="lb-code">SEC_02 // EL ESTUDIO</span>
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
      <HudPanel title="TRANSMITIR // EMPIEZA UN PROYECTO" code="SEC_03" spine>
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
