"use client";
import { useEffect, useRef, useState } from "react";

const NAV_OFFSET = "-56px 0px 0px 0px";
const DEFAULT_THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const HASH_UPDATE_MIN_INTERVAL_MS = 120;

function findMostVisibleSection(sectionIds: string[], ratios: Map<string, number>): string {
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

function updateUrlHashIfNeeded(id: string, firstSectionId: string): void {
  const targetHash = id === firstSectionId ? "" : `#${id}`;
  if (window.location.hash === targetHash) {
    return;
  }

  if (targetHash === "") {
    window.history.replaceState(null, "", window.location.pathname);
    return;
  }

  window.history.replaceState(null, "", targetHash);
}

export function useActiveSection(
  sectionIds: string[],
  options: { rootMargin?: string; threshold?: number | number[] } = {},
): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const ratios = useRef<Map<string, number>>(new Map());
  const lastHashUpdateAt = useRef(0);
  const lastHashSectionId = useRef(sectionIds[0]);
  const rootMargin = options.rootMargin ?? NAV_OFFSET;
  const threshold = options.threshold ?? DEFAULT_THRESHOLDS;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.current.set(entry.target.id, entry.intersectionRatio);
        });
        const mostVisible = findMostVisibleSection(sectionIds, ratios.current);
        setActiveId((previous) => (previous === mostVisible ? previous : mostVisible));

        const now = performance.now();
        const elapsed = now - lastHashUpdateAt.current;
        const sectionChanged = lastHashSectionId.current !== mostVisible;
        if (!sectionChanged || elapsed < HASH_UPDATE_MIN_INTERVAL_MS) {
          return;
        }

        updateUrlHashIfNeeded(mostVisible, sectionIds[0]);
        lastHashUpdateAt.current = now;
        lastHashSectionId.current = mostVisible;
      },
      {
        rootMargin,
        threshold,
      },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [rootMargin, sectionIds, threshold]);

  return activeId;
}
