"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

declare global {
  interface Window {
    __labReady?: boolean;
    __lenis?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger, SplitText);

export const motionOn = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("motion");

/**
 * Move focus to an anchor's target, as a native jump would let the next Tab
 * continue from there. Sections aren't focusable, so they get tabindex=-1
 * (globals.css hides the ring on those). If the target is still inert (the
 * mobile menu is closing), try again on the next frames.
 */
function focusTarget(el: HTMLElement, tries = 20) {
  if (el.closest("[inert]")) {
    if (tries > 0) requestAnimationFrame(() => focusTarget(el, tries - 1));
    return;
  }
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/**
 * Smooth scrolling (Lenis) driving ScrollTrigger from GSAP's ticker, plus
 * in-page anchors that glide instead of jumping. Without motion the browser
 * jumps natively; either way focus follows the anchor to its target. The
 * fixed header's height is left clear by `scroll-padding-top` on <html>,
 * which both the native jump and Lenis honour.
 */
export function MotionProvider() {
  useEffect(() => {
    window.__labReady = true;
    const lenis = motionOn() ? new Lenis({ lerp: 0.11, smoothWheel: true }) : null;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      if (!lenis) {
        // Native jump; just make sure focus lands on the target too.
        focusTarget(target);
        return;
      }
      e.preventDefault();
      const from = document.activeElement;
      focusTarget(target);
      // Lenis measures element targets against its own scroll value; if the
      // page just moved natively (focus scrolled it) and Lenis hasn't seen it
      // yet, sync first or the glide lands in the wrong place.
      if (lenis.isScrolling !== "smooth" && Math.abs(lenis.animatedScroll - window.scrollY) > 1) {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      }
      lenis.scrollTo(target, {
        duration: 1.4,
        force: true,
        // If the first attempt couldn't land (target was still inert), settle it now.
        onComplete: () => {
          const now = document.activeElement;
          if (now === document.body || now === from) focusTarget(target, 0);
        },
      });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    if (!lenis) {
      return () => document.removeEventListener("click", onClick);
    }

    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Measured positions depend on the brand fonts.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
