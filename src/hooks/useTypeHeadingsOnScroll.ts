"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useTypeHeadingsOnScroll(selector = ".section .section-reveal h2", charsPerSecond = 16): void {
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!headings.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const cleanups: Array<() => void> = [];

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

      const trigger = ScrollTrigger.create({
        trigger: heading,
        start: "top 78%",
        once: true,
        onEnter: () => {
          tween.play(0);
        },
      });

      cleanups.push(() => {
        trigger.kill();
        tween.kill();
        heading.classList.remove("typing-heading");
        heading.textContent = fullText;
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [charsPerSecond, selector]);
}
