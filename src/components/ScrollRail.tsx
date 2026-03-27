"use client";

import { useEffect } from "react";
import { useScroll } from "@/components/ScrollProvider";

export default function ScrollRail() {
  const scrollController = useScroll();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--scroll-rail-opacity", "0");
    let frameId = 0;
    let latestScrollY = scrollController?.getScrollValues().scroll ?? 0;

    const updateScrollProgress = (scrollY: number) => {
      frameId = 0;

      // Progress — use smooth-content height since ScrollSmoother sets
      // overflow:hidden on the wrapper, breaking documentElement.scrollHeight
      const contentEl = document.getElementById("smooth-content");
      const totalHeight =
        contentEl?.scrollHeight ?? document.documentElement.scrollHeight;
      const scrollRange = Math.max(totalHeight - window.innerHeight, 1);
      const progress = scrollY / scrollRange;

      // Visibility — fade in as the about section scrolls into view
      const aboutSection = document.getElementById("about");
      const revealStart = aboutSection
        ? aboutSection.offsetTop - window.innerHeight * 0.5
        : 0;
      const revealRange = Math.max(window.innerHeight * 0.12, 1);
      const railVisibility = aboutSection
        ? Math.min(Math.max((scrollY - revealStart) / revealRange, 0), 1)
        : 0;

      root.style.setProperty("--scroll-progress", `${progress}`);
      root.style.setProperty("--scroll-rail-opacity", `${railVisibility}`);
    };

    const requestProgressUpdate = (scrollY: number) => {
      latestScrollY = scrollY;
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(() =>
        updateScrollProgress(latestScrollY)
      );
    };

    const unsubscribe =
      scrollController?.subscribe((values) => {
        requestProgressUpdate(values.scroll);
      }) ?? (() => undefined);

    requestProgressUpdate(latestScrollY);

    const handleResize = () => {
      requestProgressUpdate(scrollController?.getScrollValues().scroll ?? 0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      unsubscribe();
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-rail-opacity");
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollController]);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-rail-track" />
      <div className="scroll-rail-fill" />
      <div className="scroll-rail-ball" />
    </div>
  );
}
