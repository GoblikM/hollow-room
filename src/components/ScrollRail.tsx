"use client";

import { useEffect } from "react";
import { useLocomotiveScroll } from "@/components/LocomotiveScrollProvider";

export default function ScrollRail() {
  const scrollController = useLocomotiveScroll();

  useEffect(() => {
    const root = document.documentElement;
    let frameId = 0;
    let latestScrollY = scrollController?.getScrollValues().scroll ?? 0;

    const updateScrollProgress = (scrollY: number) => {
      frameId = 0;

      const scrollRange =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? scrollY / scrollRange : 0;
      const aboutSection = document.getElementById("about");
      const revealStart = aboutSection ? aboutSection.offsetTop - 24 : 0;
      const revealRange = Math.max(window.innerHeight * 0.12, 1);
      const railVisibility = aboutSection
        ? Math.min(Math.max((scrollY - revealStart) / revealRange, 0), 1)
        : 0;

      root.style.setProperty("--scroll-progress", `${progress}`);
      root.style.setProperty("--scroll-rail-opacity", `${railVisibility}`);
    };

    const requestProgressUpdate = (scrollY: number) => {
      latestScrollY = scrollY;

      if (frameId !== 0) {
        return;
      }

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
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

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
