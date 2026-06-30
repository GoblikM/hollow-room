"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// `resetKey` re-runs the effect when it changes (e.g. the active language) so the
// animation re-captures the freshly-rendered text instead of the text it grabbed
// on first mount.
export function useTypeHeadingsOnScroll(
  selector = ".section .section-reveal h2",
  charsPerSecond = 16,
  resetKey?: unknown,
): void {
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!headings.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const cleanups: Array<() => void> = [];
    const items: Array<{ heading: HTMLElement; play: () => void; played: boolean }> = [];

    headings.forEach((heading) => {
      const fullText = (heading.textContent ?? "").trim();
      if (!fullText) return;

      const characters = Array.from(fullText);
      const state = { count: 0 };

      heading.setAttribute("aria-label", fullText);
      heading.classList.add("typing-heading");
      heading.textContent = "";

      const render = () => {
        const currentCount = Math.round(state.count);
        heading.textContent = characters.slice(0, currentCount).join("");
      };

      const tween = gsap.to(state, {
        count: characters.length,
        duration: Math.max(0.85, characters.length / Math.max(charsPerSecond, 1)),
        ease: `steps(${characters.length})`,
        paused: true,
        onUpdate: render,
        onComplete: () => {
          heading.classList.remove("typing-heading");
        },
      });

      const item = { heading, played: false, play: () => {} };
      item.play = () => {
        if (item.played) return;
        item.played = true;
        tween.play(0);
      };

      const trigger = ScrollTrigger.create({
        trigger: heading,
        start: "top 78%",
        once: true,
        onEnter: item.play,
      });

      items.push(item);
      cleanups.push(() => {
        trigger.kill();
        tween.kill();
        heading.classList.remove("typing-heading");
        // Don't restore the captured text: on a language change React has already
        // written the new text into the element, and we want the next run to read
        // that (not overwrite it with the previous language).
      });
    });

    // ScrollTrigger.onEnter doesn't fire for a heading already inside its start
    // zone when the trigger is created (scroll-restored refresh, or a language
    // re-render recreating the trigger mid-page). Type those out immediately so
    // the heading never stays blank. rAF lets ScrollSmoother settle its transform.
    const rafId = window.requestAnimationFrame(() => {
      const limit = window.innerHeight * 0.78;
      items.forEach((item) => {
        const rect = item.heading.getBoundingClientRect();
        if (rect.top < limit && rect.bottom > 0) item.play();
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [charsPerSecond, selector, resetKey]);
}
