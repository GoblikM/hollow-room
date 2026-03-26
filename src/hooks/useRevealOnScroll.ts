"use client";

import { useEffect } from "react";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

function remapProgress(value: number, start: number, end: number): number {
  return clamp((value - start) / (end - start), 0, 1);
}

export function useRevealOnScroll(selector = ".section-reveal"): void {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      elements.forEach((element) => {
        element.style.setProperty("--reveal-opacity", "1");
        element.style.setProperty("--reveal-translate-y", "0px");
        element.style.setProperty("--reveal-scale", "1");
        element.style.setProperty("--reveal-blur", "0px");
        element.style.setProperty("--reveal-brightness", "1");
      });
      return;
    }

    let frameId = 0;

    function updateRevealProgress() {
      const viewportHeight = window.innerHeight;
      const revealStart = viewportHeight * 0.92;
      const revealEnd = viewportHeight * 0.52;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const rawProgress = remapProgress(revealStart - elementCenter, 0, revealStart - revealEnd);
        const progress = easeOutCubic(rawProgress);
        const translateY = (1 - progress) * 72;
        const scale = 0.96 + progress * 0.04;
        const blur = (1 - progress) * 10;
        const brightness = 0.82 + progress * 0.18;
        const opacity = 0.28 + progress * 0.72;

        element.style.setProperty("--reveal-opacity", opacity.toFixed(3));
        element.style.setProperty("--reveal-translate-y", `${translateY.toFixed(2)}px`);
        element.style.setProperty("--reveal-scale", scale.toFixed(3));
        element.style.setProperty("--reveal-blur", `${blur.toFixed(2)}px`);
        element.style.setProperty("--reveal-brightness", brightness.toFixed(3));
      });
    }

    function scheduleUpdate() {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateRevealProgress();
      });
    }

    updateRevealProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [selector]);
}
