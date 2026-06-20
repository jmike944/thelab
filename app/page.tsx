"use client";

import * as React from "react";

/* =========================================================================
 * DATA (verbatim from the_lab_site prototype)
 * ========================================================================= */
type Project = {
  id: string;
  title: string;
  client: string;
  cat: string;
  year: string;
  bg: string;
  fg: string;
  glyph: string;
  blurb: string;
};

const PROJECTS: Project[] = [
  { id: "atlas",  title: "Atlas",  client: "Atlas Movers",   cat: "Identity", year: "2026", bg: "var(--spectrum-blue)",    fg: "#fffcf7", glyph: "Ø", blurb: "A mark in motion for a moving company — a wordmark that keeps shifting." },
  { id: "prism",  title: "Prism",  client: "Prism Festival", cat: "Campaign", year: "2025", bg: "var(--spectrum-magenta)", fg: "#fffcf7", glyph: "▲", blurb: "A spectrum identity for a music festival, built to be remixed every night." },
  { id: "forma",  title: "Forma",  client: "Forma Studio",   cat: "Branding", year: "2025", bg: "#231f20",                 fg: "#fffcf7", glyph: "◑", blurb: "Architectural branding — sharp, quiet, confident. Ink on paper." },
  { id: "juno",   title: "Juno",   client: "Juno Skincare",  cat: "Content",  year: "2026", bg: "var(--spectrum-orange)",  fg: "#231f20", glyph: "✺", blurb: "Editorial content engine for a skincare line that talks straight." },
  { id: "verde",  title: "Verde",  client: "Verde Grocers",  cat: "Identity", year: "2024", bg: "var(--spectrum-green)",   fg: "#231f20", glyph: "✦", blurb: "A fresh, friendly system for a neighbourhood grocer going citywide." },
  { id: "signal", title: "Signal", client: "Signal Audio",   cat: "Motion",   year: "2026", bg: "var(--spectrum-violet)",  fg: "#fffcf7", glyph: "))",     blurb: "Sound made visible — a motion language for an audio hardware brand." },
];

const CATS = ["All", "Branding", "Identity", "Campaign", "Content", "Motion"];

const TEAM = [
  { name: "Mara Vela", accent: true },
  { name: "Theo Lang", accent: false },
  { name: "Ines Roca", accent: false },
  { name: "Kojo Mensah", accent: false },
];

const STATS = [
  { n: "12yrs", l: "In the lab" },
  { n: "140+", l: "Brands shipped" },
  { n: "9", l: "Awards, 2025" },
  { n: "4", l: "Continents" },
];

const SVCS: [string, string][] = [
  ["Brand strategy", "Positioning, naming, narrative and the worth behind it."],
  ["Identity systems", "Marks, type, colour and the rules that hold them."],
  ["Campaigns", "Ideas that travel — across channels, formats and feeds."],
  ["Content & motion", "Editorial, film and motion language, made to scale."],
];

const INTERESTS = ["Branding", "Identity", "Campaign", "Content", "Motion", "Not sure yet"];

const MARQUEE = ["BRANDING", "IDENTITY", "CAMPAIGNS", "CONTENT", "MOTION", "STRATEGY", "CREATIVE WORTH"];

const NAV: [string, string][] = [["01", "WORK"], ["02", "METHOD"], ["03", "STUDIO"], ["04", "CONTACT"]];

const MARK = "/logos/the-lab-mark.svg";
const MARK_3D = "/logos/the-lab-3d-line.svg";
const WORDMARK = "/logos/the-lab-wordmark.svg";

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

function Avatar({ name, accent }: { name: string; accent?: boolean }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <span className={"avatar" + (accent ? " avatar--accent" : "")}>{initials}</span>;
}

/* =========================================================================
 * HOOKS
 * ========================================================================= */
function readTheme(): "signal" | "paper" {
  if (typeof document === "undefined") return "paper";
  return document.documentElement.getAttribute("data-theme") === "signal" ? "signal" : "paper";
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
  const [active, setActive] = React.useState("WORK");
  const [theme, setTheme] = React.useState<"signal" | "paper">("paper");
  const [coord, setCoord] = React.useState("45.118N 90.330W");
  const [open, setOpen] = React.useState<Project | null>(null);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => setTheme(readTheme()), []);

  function applyTheme(next: "signal" | "paper") {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "signal" ? "signal" : "");
    try {
      localStorage.setItem("lab-site-theme", next);
    } catch {}
  }
  function nav(id: string) {
    setActive(id);
    scrollToId(id === "top" ? "top" : id);
  }
  const start = () => {
    setActive("CONTACT");
    scrollToId("CONTACT");
  };

  React.useEffect(() => {
    const t = setInterval(() => {
      const a = (45.12 + (Math.random() * 0.01 - 0.005)).toFixed(3);
      const b = (90.33 + (Math.random() * 0.01 - 0.005)).toFixed(3);
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
      <div className="ls-scan" aria-hidden="true" />
      <LabHeader active={active} onNav={nav} onStart={start} theme={theme} onToggleTheme={applyTheme} />
      <LabRailLeft coord={coord} />
      <LabRailRight />
      <main className="ls-main">
        <LabHero onStart={start} onWork={() => nav("WORK")} />
        <LabMarquee items={MARQUEE} />
        <LabWork onOpen={setOpen} />
        <LabStudio />
        <LabContact sent={sent} onSend={() => setSent(true)} />
      </main>
      <LabFooter />
      {open && <CaseModal p={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/* =========================================================================
 * HEADER + RAILS
 * ========================================================================= */
function LabHeader({
  active,
  onNav,
  onStart,
  theme,
  onToggleTheme,
}: {
  active: string;
  onNav: (id: string) => void;
  onStart: () => void;
  theme: "signal" | "paper";
  onToggleTheme: (t: "signal" | "paper") => void;
}) {
  return (
    <nav className="ls-nav">
      <a
        className="ls-brand"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onNav("top");
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK} alt="The Lab" className="ls-mark" />
        <span className="ls-word">
          THE LAB <span className="ls-reg">®</span> <span className="ls-cw">CREATIVE WORTH</span>
        </span>
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
        <div className="ls-toggle" role="group" aria-label="Display mode">
          <button className={"ls-toggle__opt" + (theme === "signal" ? " is-on" : "")} onClick={() => onToggleTheme("signal")}>
            DIGITAL
          </button>
          <button className={"ls-toggle__opt" + (theme !== "signal" ? " is-on" : "")} onClick={() => onToggleTheme("paper")}>
            PAPER
          </button>
        </div>
        <button className="ls-cta" onClick={onStart}>
          START A PROJECT <span className="ls-cta__arr">→</span>
        </button>
      </div>
    </nav>
  );
}

function LabRailLeft({ coord }: { coord: string }) {
  return (
    <aside className="ls-rail ls-rail--l">
      <span className="ls-rail__txt">SYS.ON // ONLINE</span>
      <div className="ls-rail__pips">
        <StatusPip color="green" pulse />
        <StatusPip hollow />
        <StatusPip hollow />
      </div>
      <span className="ls-rail__txt">{coord}</span>
    </aside>
  );
}

function LabRailRight() {
  return (
    <aside className="ls-rail ls-rail--r">
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
  return (
    <section className="lb-hero ls-brk" id="top">
      <div className="lb-monitor">
        <span>// PRIMARY DISPLAY</span>
        <span>THE LAB® — CREATIVE WORTH</span>
        <span>FPS: 60.0</span>
      </div>
      <div className="lb-hero__grid">
        <div className="lb-hero__copy">
          <div className="lb-eyebrow">&gt;&gt; CREATIVE STUDIO — EST. IN THE LAB</div>
          <h1 className="lb-hero__title">
            Creative
            <br />
            worth<span className="lb-dot">.</span>
          </h1>
          <p className="lb-hero__sub">
            We make brands worth more — identity, campaigns and content for the ones that want range. No brief too weird.
          </p>
          <div className="lb-hero__cta">
            <button className="ls-cta ls-cta--lg" onClick={onStart}>
              START A PROJECT <span className="ls-cta__arr">→</span>
            </button>
            <button className="ls-btn-ghost" onClick={onWork}>
              SEE THE WORK
            </button>
          </div>
        </div>
        <div className="lb-hero__panel">
          <div className="lb-hero__rec">
            <StatusPip color="red" pulse label="REC [CH.01]" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lb-hero__mark" src={MARK_3D} alt="The Lab 3D mark" />
          <div className="lb-hero__plate">
            <span className="lb-code">FIG.01 — THE MARK</span>
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
        <div
          style={{
            height: "100%",
            background: p.bg,
            color: p.fg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: 84, lineHeight: 1 }}>{p.glyph}</span>
          <span
            style={{
              position: "absolute",
              bottom: 12,
              left: 14,
              fontFamily: "var(--font-head)",
              fontSize: 26,
              letterSpacing: "-.01em",
            }}
          >
            {p.title}
          </span>
        </div>
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
  const [cat, setCat] = React.useState("All");
  const shown = cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat);
  return (
    <section className="lb-sec" id="WORK">
      <div className="lb-workhead">
        <div>
          <div className="lb-eyebrow" style={{ color: "var(--hud-muted)", marginBottom: "8px" }}>
            SELECTED WORK // SEC_01
          </div>
          <h2 className="lb-worktitle">
            Made in the lab<span className="lb-dot">.</span>
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
    <section className="lb-sec" id="STUDIO">
      <div className="lb-sechead">
        <span className="lb-code">SEC_03 // THE STUDIO</span>
        <SpectrumBar size="sm" style={{ flex: 1, opacity: 0.6 }} />
      </div>
      <div className="lb-studio2">
        <div>
          <div className="lb-eyebrow" style={{ marginBottom: "14px" }}>
            THE STUDIO
          </div>
          <h2 className="lb-h2">
            We treat creative as an asset — something that compounds, not decoration that fades.
          </h2>
          <p className="lb-body">
            The Lab is a small, senior studio. We work in tight loops with founders and brand teams, prototype fast,
            and ship systems that hold up in the wild. The experiments stay in the lab — the worth ships to you.
          </p>
          <div className="lb-crew">
            <div className="avatar-stack">
              {TEAM.map((t) => (
                <Avatar key={t.name} name={t.name} accent={t.accent} />
              ))}
            </div>
            <span className="lb-crew__cap">A senior team of four, plus a deep bench.</span>
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
      <div className="lb-svc">
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
    <section className="lb-sec" id="CONTACT">
      <HudPanel title="TRANSMIT // START A PROJECT" code="SEC_04" spine>
        {sent ? (
          <div className="lb-sent">
            <StatusPip color="green" pulse label="SIGNAL RECEIVED" />
            <h2 className="lb-h2" style={{ marginTop: "12px" }}>
              Transmission logged.
            </h2>
            <p className="lb-body">
              We&apos;ll decode your brief and reply within two working days. Frequency locked.
            </p>
          </div>
        ) : (
          <div className="lb-contact2">
            <div className="lb-form">
              <div className="lb-form__row">
                <label>
                  <span className="lb-field__lbl">Name</span>
                  <input className="lb-input" placeholder="Your name" />
                </label>
                <label>
                  <span className="lb-field__lbl">Email</span>
                  <input className="lb-input" type="email" placeholder="you@company.com" />
                </label>
              </div>
              <div className="lb-field">
                <span className="lb-field__lbl">Interested in</span>
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
                <span className="lb-field__lbl">The brief</span>
                <textarea className="lb-textarea" rows={3} placeholder="What are we making?" />
              </label>
              <button className="ls-cta ls-cta--lg" onClick={onSend} style={{ alignSelf: "flex-start" }}>
                TRANSMIT BRIEF <span className="ls-cta__arr">→</span>
              </button>
            </div>
            <aside className="lb-coord">
              <div className="lb-coord__row">
                <span className="lb-coord__k">Channel</span>
                <span className="lb-coord__v">144.20 MHz</span>
              </div>
              <div className="lb-coord__row">
                <span className="lb-coord__k">Studio</span>
                <span className="lb-coord__v">hello@thelab.mx</span>
              </div>
              <div className="lb-coord__row">
                <span className="lb-coord__k">Location</span>
                <span className="lb-coord__v">México · 45.118N 90.330W</span>
              </div>
              <div className="lb-coord__row">
                <span className="lb-coord__k">Response</span>
                <span className="lb-coord__v">&le; 2 working days</span>
              </div>
              <div className="lb-coord__status">
                <StatusPip color="green" pulse label="LINE OPEN" />
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
        <StatusPip color="green" label="SYS.STATUS: NOMINAL" />
        <span className="ls-footer__c">©2026 THE LAB® — END OF TRANSMISSION.</span>
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
          <button className="lb-modal__x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="lb-modal__hero" style={{ background: p.bg, color: p.fg }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 96, lineHeight: 1 }}>{p.glyph}</span>
        </div>
        <SpectrumBar />
        <div className="lb-modal__bd">
          <div className="lb-code" style={{ marginBottom: "10px" }}>
            {p.cat} · {p.year}
          </div>
          <h2 className="lb-h2" style={{ fontSize: "32px" }}>
            {p.title}
          </h2>
          <div style={{ fontWeight: 800, color: "var(--hud-accent)", marginBottom: "12px", fontSize: "13px", letterSpacing: ".04em" }}>
            {p.client}
          </div>
          <p className="lb-body" style={{ maxWidth: "none" }}>
            {p.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}
