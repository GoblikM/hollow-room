"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useRevealOnScroll(selector = ".section-reveal"): void {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      elements.forEach((element) => {
        gsap.set(element, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px) brightness(1)",
        });
      });
      return;
    }

    const cleanups: Array<() => void> = [];

    elements.forEach((element) => {
      gsap.set(element, {
        opacity: 0,
        y: 28,
        scale: 0.985,
        filter: "blur(8px) brightness(0.9)",
      });

      const tween = gsap.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px) brightness(1)",
        duration: 0.92,
        ease: "power2.out",
        paused: true,
      });

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 68%",
        onEnter: () => {
          tween.play();
        },
        once: true,
      });

      cleanups.push(() => {
        trigger.kill();
        tween.kill();
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ScrollTrigger.refresh();
    };
  }, [selector]);
}
