"use client";

import { useSyncExternalStore } from "react";
import { PAUSE_KEY } from "./pause-key";

/*
 * "Pausar animaciones" (WCAG 2.2.2). One switch for the whole page: it puts
 * `is-paused` on <html> (globals.css then freezes every CSS loop), tells JS
 * loops through a `lab:pause` event, and is remembered in localStorage. The
 * class is restored before first paint by the boot script in app/layout.tsx.
 * Scroll-driven scenes are the reader's own doing and keep working.
 */

declare global {
  interface WindowEventMap {
    "lab:pause": CustomEvent<{ paused: boolean }>;
  }
}

const isPaused = () => document.documentElement.classList.contains("is-paused");

function subscribe(onChange: () => void) {
  window.addEventListener("lab:pause", onChange);
  return () => window.removeEventListener("lab:pause", onChange);
}

export function setPaused(paused: boolean) {
  document.documentElement.classList.toggle("is-paused", paused);
  try {
    if (paused) localStorage.setItem(PAUSE_KEY, "1");
    else localStorage.removeItem(PAUSE_KEY);
  } catch {
    // Storage can be blocked; the switch still works for this visit.
  }
  window.dispatchEvent(new CustomEvent("lab:pause", { detail: { paused } }));
}

/**
 * The toggle. Its name stays "Pausar animaciones" and aria-pressed carries the
 * state (pressed = paused); pressed, it fills with ink like the tilted tags.
 */
export function PauseToggle({ className }: { className?: string }) {
  const paused = useSyncExternalStore(subscribe, isPaused, () => false);
  return (
    <button
      type="button"
      className={`pause-btn${className ? ` ${className}` : ""}`}
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
    >
      <i className="pause-ico" aria-hidden="true" />
      <span className="pause-l">Pausar animaciones</span>
    </button>
  );
}
