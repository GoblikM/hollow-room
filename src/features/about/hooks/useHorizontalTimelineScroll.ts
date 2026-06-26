"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type Options = {
  /** Disable this hook (e.g. on mobile where timeline is vertical). Default: false */
  disabled?: boolean;
  /**
   * Called after each step change.
   * Use this to update DOM state (active dots, entry highlights, etc.)
   * without triggering React re-renders.
   */
  onUpdate?: (currentIndex: number, totalCount: number) => void;
};

type Return = {
  /** Ref to attach to the outer <section> element. */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Ref to attach to the horizontally-scrolling track <div>. */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to attach to the step progress-fill <div> (scaleX 0→1). */
  progressRef: React.RefObject<HTMLDivElement | null>;
  /**
   * true when on the first entry — snap scroll may go to the previous section.
   * false when mid-track — snap scroll is blocked in the backward direction.
   */
  canLeavePrev: React.MutableRefObject<boolean>;
  /**
   * true when on the last entry — snap scroll may go to the next section.
   * false when mid-track — snap scroll is blocked in the forward direction.
   */
  canLeaveNext: React.MutableRefObject<boolean>;
  /** Navigate by one step: +1 = next entry, -1 = previous entry. */
  scrollBy: (delta: number) => void;
  /** Navigate to an absolute entry index. */
  stepTo: (index: number) => void;
};

/**
 * Manages a step-based (one-at-a-time) horizontal carousel for the timeline.
 *
 * Each wheel notch or swipe moves exactly one entry forward or backward.
 * Scroll events are captured before GSAP ScrollSmoother sees them while the
 * user is mid-track. At the first or last entry the events are released so
 * useSnapScroll can navigate to the adjacent page section.
 *
 * isInSection() uses getBoundingClientRect() to detect the visual viewport
 * position — this works correctly with ScrollSmoother's CSS-transform scroll.
 */
export function useHorizontalTimelineScroll({
  disabled = false,
  onUpdate,
}: Options = {}): Return {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  const isSteppingRef = useRef(false);

  const canLeavePrev = useRef(true);
  const canLeaveNext = useRef(false);

  const onUpdateRef = useRef(onUpdate);
  useLayoutEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  function getEntryCount(): number {
    return trackRef.current?.children.length ?? 1;
  }

  function getEntryWidth(): number {
    // Each entry fills the full visible width of the track-outer.
    return trackRef.current?.parentElement?.clientWidth ?? window.innerWidth;
  }

  function updateProgress(index: number, total: number) {
    if (progressRef.current) {
      const ratio = total > 1 ? index / (total - 1) : 1;
      gsap.set(progressRef.current, { scaleX: ratio, transformOrigin: "left center" });
    }
  }

  // ── Core step function — called imperatively and from event handlers ──────

  function stepTo(targetIndex: number) {
    const total = getEntryCount();
    const clamped = Math.max(0, Math.min(total - 1, targetIndex));
    if (clamped === currentIndexRef.current && !isSteppingRef.current) return;

    currentIndexRef.current = clamped;
    canLeavePrev.current = clamped === 0;
    canLeaveNext.current = clamped === total - 1;

    const entryWidth = getEntryWidth();

    isSteppingRef.current = true;
    gsap.to(trackRef.current, {
      x: -(clamped * entryWidth),
      duration: 0.65,
      ease: "power2.inOut",
      onComplete: () => {
        isSteppingRef.current = false;
      },
    });

    updateProgress(clamped, total);
    onUpdateRef.current?.(clamped, total);
  }

  function scrollBy(delta: number) {
    const dir = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    if (dir === 0) return;
    stepTo(currentIndexRef.current + dir);
  }

  useEffect(() => {
    if (disabled) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Section detection ─────────────────────────────────────────────────
    //
    // Uses getBoundingClientRect() — this reads the VISUAL position and
    // accounts for ScrollSmoother's CSS-transform on #smooth-content.
    // Comparing window.scrollY to element.offsetTop does NOT work here
    // because offsetTop is relative to the nearest positioned ancestor, not
    // the viewport.

    function isInSection(): boolean {
      const section = sectionRef.current;
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      // Consider "in section" when the section top is within ±40% of viewport.
      return Math.abs(rect.top) < window.innerHeight * 0.4;
    }

    // ── Resize: re-snap to current index so layout stays correct ─────────

    function handleResize() {
      if (!trackRef.current) return;
      const entryWidth = getEntryWidth();
      gsap.set(trackRef.current, { x: -(currentIndexRef.current * entryWidth) });
    }

    // ── Wheel ─────────────────────────────────────────────────────────────

    function handleWheel(e: WheelEvent) {
      if (!isInSection()) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      // At edge: release to snap-scroll.
      if (dir > 0 && canLeaveNext.current) return;
      if (dir < 0 && canLeavePrev.current) return;

      // Consume the event — we handle it as a step.
      e.preventDefault();
      e.stopPropagation();

      // Ignore rapid follow-up events while animation plays.
      if (isSteppingRef.current) return;

      if (prefersReducedMotion) {
        const total = getEntryCount();
        const clamped = Math.max(0, Math.min(total - 1, currentIndexRef.current + dir));
        currentIndexRef.current = clamped;
        canLeavePrev.current = clamped === 0;
        canLeaveNext.current = clamped === total - 1;
        gsap.set(trackRef.current, { x: -(clamped * getEntryWidth()) });
        updateProgress(clamped, total);
        onUpdateRef.current?.(clamped, total);
        return;
      }

      scrollBy(dir);
    }

    // ── Touch ─────────────────────────────────────────────────────────────

    let touchStartY = 0;

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!isInSection()) return;
      if (isSteppingRef.current) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 40) return; // dead-zone

      const dir = deltaY > 0 ? 1 : -1;
      if (dir > 0 && canLeaveNext.current) return;
      if (dir < 0 && canLeavePrev.current) return;

      e.preventDefault();
      scrollBy(dir);
    }

    // ── Keyboard ──────────────────────────────────────────────────────────

    function handleKeyDown(e: KeyboardEvent) {
      if (!isInSection()) return;
      if (isSteppingRef.current) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-1);
      }
    }

    // ── Init ──────────────────────────────────────────────────────────────

    const initFrame = requestAnimationFrame(() => {
      const total = getEntryCount();
      if (total <= 1) canLeaveNext.current = true;
      updateProgress(0, total);
      onUpdateRef.current?.(0, total);
    });

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false, capture: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(initFrame);
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchend", handleTouchEnd, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [disabled]);

  return {
    sectionRef,
    trackRef,
    progressRef,
    canLeavePrev,
    canLeaveNext,
    scrollBy,
    stepTo,
  };
}
