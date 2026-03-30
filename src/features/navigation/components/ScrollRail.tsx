"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useScroll } from "@/app/providers/ScrollProvider";
import { NAV_LINKS, SECTION_IDS } from "@/features/navigation/constants/navigation";
import {
  collectSectionMetrics,
  findCenterSection,
  getCenteredScrollTarget,
  getRailProgressFromSections,
  type SectionMetrics,
} from "@/shared/utils/scrollRailMath";

type RailStopStyle = CSSProperties & { "--rail-stop": string };
export type ScrollRailSection = {
  id: string;
  label: string;
};

const DEFAULT_SECTIONS: ScrollRailSection[] = NAV_LINKS.map(({ id, label }) => ({
  id,
  label,
}));

type ScrollRailProps = {
  sections?: ScrollRailSection[];
  revealSectionId?: string | null;
  ariaLabel?: string;
};

export default function ScrollRail({
  sections,
  revealSectionId = "about",
  ariaLabel = "Section navigation rail",
}: ScrollRailProps) {
  const scrollController = useScroll();
  const [isFlowLocked, setIsFlowLocked] = useState(false);
  const resolvedSections = useMemo(() => (sections && sections.length > 0 ? sections : DEFAULT_SECTIONS), [sections]);
  const sectionIds = useMemo(() => {
    if (resolvedSections.length === 0) return SECTION_IDS;
    return resolvedSections.map((section) => section.id);
  }, [resolvedSections]);
  const fallbackId = sectionIds[0] ?? SECTION_IDS[0] ?? "home";
  const sectionsRef = useRef<SectionMetrics[]>([]);
  const [activeCenterSection, setActiveCenterSection] = useState<string>(fallbackId);

  useEffect(() => {
    const syncLockState = () => {
      setIsFlowLocked(document.body.classList.contains("guided-flow-pending"));
    };

    const handleGuidedFlowLockChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>;
      setIsFlowLocked(Boolean(customEvent.detail?.locked));
    };

    syncLockState();
    window.addEventListener("guidedFlowLockChanged", handleGuidedFlowLockChange);

    return () => {
      window.removeEventListener("guidedFlowLockChanged", handleGuidedFlowLockChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--scroll-rail-opacity", "0");
    let frameId = 0;
    let latestScrollY = scrollController.getScrollValues().scroll;

    const refreshSectionMetrics = () => {
      sectionsRef.current = collectSectionMetrics(sectionIds);
    };

    const updateScrollProgress = (scrollY: number) => {
      frameId = 0;
      if (sectionsRef.current.length === 0) {
        refreshSectionMetrics();
      }

      const sections = sectionsRef.current;
      const progress = getRailProgressFromSections(scrollY, sections);

      // Visibility — fade in as the about section scrolls into view
      const revealSection = revealSectionId ? document.getElementById(revealSectionId) : null;
      const revealStart = revealSection ? revealSection.offsetTop - window.innerHeight * 0.5 : 0;
      const revealRange = Math.max(window.innerHeight * 0.12, 1);
      const railVisibility = revealSection
        ? Math.min(Math.max((scrollY - revealStart) / revealRange, 0), 1)
        : revealSectionId
          ? 0
          : 1;
      const centerSection = findCenterSection(scrollY, sections, fallbackId);

      root.style.setProperty("--scroll-progress", `${progress}`);
      root.style.setProperty("--scroll-rail-opacity", `${railVisibility}`);
      setActiveCenterSection((previous) => (previous === centerSection ? previous : centerSection));
    };

    const requestProgressUpdate = (scrollY: number) => {
      latestScrollY = scrollY;
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(() => updateScrollProgress(latestScrollY));
    };

    const unsubscribe = scrollController.subscribe((values) => {
      requestProgressUpdate(values.scroll);
    });

    refreshSectionMetrics();
    requestProgressUpdate(latestScrollY);

    const handleResize = () => {
      refreshSectionMetrics();
      requestProgressUpdate(scrollController.getScrollValues().scroll);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      unsubscribe();
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-rail-opacity");
      window.removeEventListener("resize", handleResize);
    };
  }, [fallbackId, revealSectionId, scrollController, sectionIds]);

  const handleScrollToSection = (sectionId: string) => {
    if (isFlowLocked) {
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    const scrollLimit = scrollController.getScrollValues().limit;
    const clampedTarget = getCenteredScrollTarget(
      section.offsetTop,
      section.offsetHeight,
      window.innerHeight,
      scrollLimit,
    );

    scrollController.scrollTo(clampedTarget, { duration: 1.5 });
  };

  if (resolvedSections.length === 0) {
    return null;
  }

  return (
    <nav className="scroll-rail" aria-label={ariaLabel}>
      <div className="scroll-rail-track" />
      <div className="scroll-rail-fill" />
      <div className="scroll-rail-ball" />

      <ol className="scroll-rail-labels">
        {resolvedSections.map((section, index) => {
          const sectionId = section.id;
          const isActive = activeCenterSection === sectionId;
          const position = index / Math.max(resolvedSections.length - 1, 1);
          const railStopStyle: RailStopStyle = {
            "--rail-stop": `${position}`,
          };

          return (
            <li key={sectionId} className="scroll-rail-label-item" style={railStopStyle}>
              <button
                type="button"
                className={`scroll-rail-label nav-link hover-text-glitch text-glitch-soft ${
                  isActive ? "scroll-rail-label-active nav-link-active" : ""
                }`}
                aria-current={isActive ? "location" : undefined}
                aria-disabled={isFlowLocked}
                disabled={isFlowLocked}
                onClick={() => handleScrollToSection(sectionId)}
              >
                {section.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
