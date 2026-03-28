"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

type SnapScrollOptions = {
  /** CSS selector for snap targets. Default: "section[id]" */
  selector?: string;
  /** GSAP tween duration in seconds. Default: 1.0 */
  duration?: number;
  /** Minimum swipe distance (px) to trigger snap on touch. Default: 50 */
  touchThreshold?: number;
  /**
   * How close to the edge of a tall section (as fraction of viewport height)
   * the user must be before snapping to the next section. Default: 0.15
   */
  edgeThreshold?: number;
  /**
   * Callback that returns the current scroll position in pixels.
   * Required when using a virtual scroller (e.g. ScrollSmoother).
   * Defaults to window.scrollY.
   */
  getScrollY?: () => number;
  /** Scroll container to attach wheel/touch listeners to. Default: document.documentElement */
  container?: () => HTMLElement | null;
};

export function useSnapScroll({
  selector = "section[id]",
  duration = 1.0,
  touchThreshold = 50,
  edgeThreshold = 0.15,
  getScrollY = () => window.scrollY,
  container = () => document.documentElement,
}: SnapScrollOptions = {}) {
  const isSnappingRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function getSections(): HTMLElement[] {
      return Array.from(document.querySelectorAll<HTMLElement>(selector));
    }

    function getCurrentSectionIndex(scrollY: number, sections: HTMLElement[]): number {
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollY + window.innerHeight * 0.4) {
          idx = i;
        }
      }
      return idx;
    }

    function canSnap(dir: number, section: HTMLElement, scrollY: number): boolean {
      const vh = window.innerHeight;
      if (section.offsetHeight <= vh) return true;
      const threshold = vh * edgeThreshold;
      return dir > 0
        ? scrollY + vh >= section.offsetTop + section.offsetHeight - threshold
        : scrollY <= section.offsetTop + threshold;
    }

    function snapTo(targetEl: HTMLElement) {
      if (isSnappingRef.current) return;
      isSnappingRef.current = true;
      gsap.to(window, {
        scrollTo: { y: targetEl.offsetTop, autoKill: false },
        duration,
        ease: "power2.inOut",
        onComplete: () => {
          isSnappingRef.current = false;
        },
      });
    }

    function trySnap(dir: number): boolean {
      const sections = getSections();
      if (!sections.length) return false;
      const scrollY = getScrollY();
      const currentIdx = getCurrentSectionIndex(scrollY, sections);
      const targetIdx = Math.max(0, Math.min(sections.length - 1, currentIdx + dir));
      if (targetIdx === currentIdx) return false;
      if (!canSnap(dir, sections[currentIdx], scrollY)) return false;
      snapTo(sections[targetIdx]);
      return true;
    }

    function handleWheel(e: WheelEvent) {
      if (isSnappingRef.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (trySnap(dir)) e.preventDefault();
    }

    let touchStartY = 0;

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (isSnappingRef.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < touchThreshold) return;
      trySnap(deltaY > 0 ? 1 : -1);
    }

    const el = container();
    el?.addEventListener("wheel", handleWheel, { passive: false });
    el?.addEventListener("touchstart", handleTouchStart, { passive: true });
    el?.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el?.removeEventListener("wheel", handleWheel);
      el?.removeEventListener("touchstart", handleTouchStart);
      el?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selector, duration, touchThreshold, edgeThreshold, getScrollY, container]);
}
