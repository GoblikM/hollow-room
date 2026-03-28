"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { NAV_HEIGHT } from "@/components/Nav";
import { useScroll } from "@/components/ScrollProvider";
import { NAV_LINKS, SECTION_IDS } from "@/constants/navigation";

type RailStopStyle = CSSProperties & { "--rail-stop": string };

function findCenterSection(scrollY: number): string {
  const viewportCenter = scrollY + window.innerHeight / 2;

  for (const id of SECTION_IDS) {
    const section = document.getElementById(id);
    if (!section) continue;

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (viewportCenter >= top && viewportCenter < bottom) {
      return id;
    }
  }

  // Fallback: if center line is between sections, pick nearest section center.
  let nearestId = SECTION_IDS[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const id of SECTION_IDS) {
    const section = document.getElementById(id);
    if (!section) continue;

    const sectionCenter = section.offsetTop + section.offsetHeight / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestId = id;
    }
  }

  return nearestId;
}

export default function ScrollRail() {
  const scrollController = useScroll();
  const [activeCenterSection, setActiveCenterSection] = useState<string>(
    SECTION_IDS[0],
  );

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
      const centerSection = findCenterSection(scrollY);

      root.style.setProperty("--scroll-progress", `${progress}`);
      root.style.setProperty("--scroll-rail-opacity", `${railVisibility}`);
      setActiveCenterSection((previous) =>
        previous === centerSection ? previous : centerSection,
      );
    };

    const requestProgressUpdate = (scrollY: number) => {
      latestScrollY = scrollY;
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(() =>
        updateScrollProgress(latestScrollY),
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

  const handleScrollToSection = (sectionId: string) => {
    scrollController?.scrollTo(`#${sectionId}`, {
      offset: sectionId === "home" ? 0 : -NAV_HEIGHT,
    });
  };

  return (
    <nav className="scroll-rail" aria-label="Section navigation rail">
      <div className="scroll-rail-track" />
      <div className="scroll-rail-fill" />
      <div className="scroll-rail-ball" />

      <ol className="scroll-rail-labels">
        {NAV_LINKS.map((link, index) => {
          const sectionId = link.href.replace("#", "");
          const isActive = activeCenterSection === sectionId;
          const position = index / Math.max(NAV_LINKS.length - 1, 1);
          const railStopStyle: RailStopStyle = {
            "--rail-stop": `${position}`,
          };

          return (
            <li
              key={sectionId}
              className="scroll-rail-label-item"
              style={railStopStyle}
            >
              <button
                type="button"
                className={`scroll-rail-label nav-link hover-text-glitch text-glitch-soft ${
                  isActive ? "scroll-rail-label-active nav-link-active" : ""
                }`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => handleScrollToSection(sectionId)}
              >
                {link.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
