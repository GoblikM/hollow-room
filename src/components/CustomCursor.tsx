"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Enable only when the primary input supports precise hover.
    const supportsCustomCursor = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!supportsCustomCursor) return;

    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const INTERACTIVE = "a, button, [data-cursor-hover]";

    const onEnter = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest(INTERACTIVE);
      if (!interactive) return;
      const from = e.relatedTarget as HTMLElement | null;
      if (!from || !interactive.contains(from)) setHovered(true);
    };

    const onLeave = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest(INTERACTIVE);
      if (!interactive) return;
      const to = e.relatedTarget as HTMLElement | null;
      if (!to || !interactive.contains(to)) setHovered(false);
    };

    const onMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const onMouseEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("pointerover", onEnter, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    const RING_LERP = 0.12;

    function tick() {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }

      if (ring) {
        ringPosRef.current.x +=
          (posRef.current.x - ringPosRef.current.x) * RING_LERP;
        ringPosRef.current.y +=
          (posRef.current.y - ringPosRef.current.y) * RING_LERP;
        ring.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot"
        data-hovered={hovered}
        data-visible={visible}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring"
        data-hovered={hovered}
        data-visible={visible}
      />
    </>
  );
}
