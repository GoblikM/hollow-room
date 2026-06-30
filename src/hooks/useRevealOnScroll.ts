"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_HIDDEN = { opacity: 0, y: 28, scale: 0.985, filter: "blur(8px) brightness(0.9)" };
const REVEAL_SHOWN = { opacity: 1, y: 0, scale: 1, filter: "blur(0px) brightness(1)" };
// Element top must be above this fraction of the viewport to count as "entered".
const REVEAL_START = 0.68;

// `resetKey` re-runs the effect when it changes (e.g. the active language) so the
// triggers are rebuilt against the freshly-rendered DOM.
export function useRevealOnScroll(selector = ".section-reveal", resetKey?: unknown): void {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      elements.forEach((element) => gsap.set(element, REVEAL_SHOWN));
      return;
    }

    const cleanups: Array<() => void> = [];
    const items: Array<{ element: HTMLElement; play: () => void }> = [];

    elements.forEach((element) => {
      // If the element is already on screen at setup (scroll-restored refresh or a
      // re-render that recreates triggers mid-page), reveal it straight away —
      // ScrollTrigger.onEnter does NOT fire for triggers born inside their zone.
      const rect = element.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * REVEAL_START && rect.bottom > 0;
      if (alreadyVisible) {
        gsap.set(element, REVEAL_SHOWN);
        return;
      }

      gsap.set(element, REVEAL_HIDDEN);

      const tween = gsap.to(element, { ...REVEAL_SHOWN, duration: 0.92, ease: "power2.out", paused: true });
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: `top ${REVEAL_START * 100}%`,
        onEnter: () => tween.play(),
        once: true,
      });

      items.push({ element, play: () => tween.play() });
      cleanups.push(() => {
        trigger.kill();
        tween.kill();
      });
    });

    // Backup pass one frame later: ScrollSmoother may apply its scroll transform
    // after this effect runs, so an element that looked off-screen above can now be
    // in view with a trigger that will never fire onEnter. Reveal those too.
    const rafId = window.requestAnimationFrame(() => {
      const limit = window.innerHeight * REVEAL_START;
      items.forEach(({ element, play }) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < limit && rect.bottom > 0) play();
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      cleanups.forEach((cleanup) => cleanup());
      ScrollTrigger.refresh();
    };
  }, [selector, resetKey]);
}
