"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT, NAV } from "@/lib/content";
import { Btn } from "./ui/btn";
import { PauseToggle } from "./ui/pause";

/**
 * Fixed header. The brand stays hidden while the cover's masthead is on screen
 * (the masthead is the brand there), the bar turns solid once you scroll, hides
 * on the way down and comes back on the way up, and turns ink over any
 * [data-tone="dark"] section. Under 860px the links move into a full-screen
 * menu that opens with a circle from its button.
 *
 * The menu is a sibling of <header>, not a child: the bar's backdrop-filter and
 * hide transform would otherwise become the containing block of the fixed menu
 * and shrink it to the bar.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Set when a menu link closes the menu: focus goes on to its section, not back to "Menú". */
  const viaLink = useRef(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const head = ref.current;
    if (!head) return;
    let last = window.scrollY;
    let upFrom: number | null = null;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      head.classList.toggle("is-solid", y > 40);
      if (y < 80) {
        head.classList.remove("is-hidden");
        upFrom = null;
      } else if (y > last) {
        head.classList.add("is-hidden");
        upFrom = null;
      } else if (y < last) {
        if (upFrom === null) upFrom = last;
        if (upFrom - y > 10) head.classList.remove("is-hidden");
      }
      last = y;

      const mast = document.querySelector("[data-mast]");
      head.classList.toggle("at-cover", !!mast && mast.getBoundingClientRect().bottom > 0);

      // Full-bleed scenes (the film) ask for the whole screen: step aside while they cover the bar.
      const h = head.offsetHeight;
      let away = false;
      document.querySelectorAll<HTMLElement>("[data-hide-head]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= h && r.bottom > h) away = true;
      });
      head.classList.toggle("is-away", away);

      const mid = h / 2;
      let dark = false;
      document.querySelectorAll<HTMLElement>('[data-tone="dark"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) dark = true;
      });
      head.classList.toggle("on-dark", dark);

      // The current section is the one whose top most recently crossed the line,
      // judged by position on the page, not by the order of NAV.
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      let best = -Infinity;
      for (const [id] of NAV) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top != null && top <= line && top > best) {
          best = top;
          current = id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // While the menu is open it is a modal: the page (and Lenis) is locked,
  // everything outside the menu is inert, focus starts on "Cerrar" and Tab
  // wraps inside. Escape closes it; focus then returns to "Menú".
  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;

    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const outside = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== menu && !el.contains(menu) && !el.inert,
    );
    outside.forEach((el) => (el.inert = true));
    // Focus "Cerrar". It can still be mid-way to visible for a frame (the
    // reduced-motion rule gives every element a tiny transition), so retry.
    let raf = 0;
    const focusClose = (tries = 6) => {
      const btn = closeRef.current;
      if (!btn) return;
      btn.focus();
      if (document.activeElement !== btn && tries > 0) raf = requestAnimationFrame(() => focusClose(tries - 1));
    };
    focusClose();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const lastItem = items[items.length - 1];
      const inside = menu.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && (document.activeElement === lastItem || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // The menu only exists on narrow screens; widening the window closes it.
    const wide = window.matchMedia("(min-width: 861px)");
    const onWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onWide);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      outside.forEach((el) => (el.inert = false));
      document.body.style.overflow = "";
      window.__lenis?.start();
      const lost = document.activeElement === document.body || menu.contains(document.activeElement);
      if (!viaLink.current && lost) menuBtnRef.current?.focus();
      viaLink.current = false;
    };
  }, [open]);

  return (
    <>
      <header ref={ref} className="head at-cover" data-head>
        <div className="head-in">
          <a className="head-brand" href="#top" aria-label="The Lab, ir al inicio">
            <span className="logo-mask" aria-hidden="true" />
          </a>
          <div className="head-side">
            <PauseToggle className="head-pause" />
            <nav className="head-nav" aria-label="Principal">
              {NAV.map(([id, label]) => (
                <a key={id} className="link" href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                  {label}
                </a>
              ))}
              <Btn href="#contacto" sub="< 2 días hábiles">
                Empezar un proyecto
              </Btn>
            </nav>
            <button
              ref={menuBtnRef}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              Menú <i aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        className={`menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <button ref={closeRef} type="button" className="menu-btn menu-close" onClick={() => setOpen(false)}>
          Cerrar
        </button>
        <nav className="menu-links" aria-label="Secciones">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              onClick={() => {
                viaLink.current = true;
                setOpen(false);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <p className="mono">
            {CONTACT.city} — {CONTACT.instagram}
          </p>
          <PauseToggle />
        </div>
      </div>
    </>
  );
}
