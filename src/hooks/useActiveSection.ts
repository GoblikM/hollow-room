"use client";
import { useEffect, useRef, useState } from "react";

export function useActiveSection(
  sectionIds: string[],
  options: { rootMargin?: string; threshold?: number } = {}
): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.current.set(entry.target.id, entry.intersectionRatio);
        });
        // find section with highest intersection ratio
        let maxId = sectionIds[0];
        let maxRatio = 0;
        sectionIds.forEach((id) => {
          const r = ratios.current.get(id) ?? 0;
          if (r > maxRatio) {
            maxRatio = r;
            maxId = id;
          }
        });
        setActiveId(maxId);
        // update URL hash
        if (maxId === sectionIds[0]) {
          window.history.replaceState(null, "", window.location.pathname);
        } else {
          window.history.replaceState(null, "", `#${maxId}`);
        }
      },
      {
        rootMargin: options.rootMargin ?? "-56px 0px 0px 0px",
        threshold: options.threshold ?? [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] as unknown as number,
      }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds.join(",")]);

  return activeId;
}
