"use client";
import { useEffect, useRef, useState } from "react";

const NAV_OFFSET = "-56px 0px 0px 0px";
const DEFAULT_THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

function findMostVisibleSection(
  sectionIds: string[],
  ratios: Map<string, number>
): string {
  let maxId = sectionIds[0];
  let maxRatio = 0;
  sectionIds.forEach((id) => {
    const r = ratios.get(id) ?? 0;
    if (r > maxRatio) {
      maxRatio = r;
      maxId = id;
    }
  });
  return maxId;
}

function updateUrlHash(id: string, firstSectionId: string): void {
  if (id === firstSectionId) {
    window.history.replaceState(null, "", window.location.pathname);
  } else {
    window.history.replaceState(null, "", `#${id}`);
  }
}

export function useActiveSection(
  sectionIds: string[],
  options: { rootMargin?: string; threshold?: number | number[] } = {}
): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const ratios = useRef<Map<string, number>>(new Map());
  const rootMargin = options.rootMargin ?? NAV_OFFSET;
  const threshold = options.threshold ?? DEFAULT_THRESHOLDS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.current.set(entry.target.id, entry.intersectionRatio);
        });
        const mostVisible = findMostVisibleSection(sectionIds, ratios.current);
        setActiveId(mostVisible);
        updateUrlHash(mostVisible, sectionIds[0]);
      },
      {
        rootMargin,
        threshold,
      }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [rootMargin, sectionIds, threshold]);

  return activeId;
}
