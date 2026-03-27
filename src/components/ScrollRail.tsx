"use client";

import { useEffect } from "react";

export default function ScrollRail() {
  useEffect(() => {
    const root = document.documentElement;
    let frameId = 0;

    const updateScrollProgress = () => {
      frameId = 0;

      const scrollRange =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
      const aboutSection = document.getElementById("about");
      const revealStart = aboutSection ? aboutSection.offsetTop - 24 : 0;
      const revealRange = Math.max(window.innerHeight * 0.12, 1);
      const railVisibility = aboutSection
        ? Math.min(Math.max((window.scrollY - revealStart) / revealRange, 0), 1)
        : 0;

      root.style.setProperty("--scroll-progress", `${progress}`);
      root.style.setProperty("--scroll-rail-opacity", `${railVisibility}`);
    };

    const requestProgressUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();

    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-rail-opacity");
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
    };
  }, []);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-rail-track" />
      <div className="scroll-rail-fill" />
      <div className="scroll-rail-ball" />
    </div>
  );
}
