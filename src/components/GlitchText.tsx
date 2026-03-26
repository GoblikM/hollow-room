"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const GLITCH_MIN_DELAY_MS = 3000;
const GLITCH_MAX_DELAY_MS = 8000;
const GLITCH_DURATION_MS = 1000;

type GlitchTextProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
};

function randomDelay(): number {
  return (
    GLITCH_MIN_DELAY_MS +
    Math.random() * (GLITCH_MAX_DELAY_MS - GLITCH_MIN_DELAY_MS)
  );
}

export default function GlitchText({
  children,
  className = "",
  as: Tag = "span",
  style,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (autoTimeoutRef.current !== null) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
    if (animTimeoutRef.current !== null) {
      clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = null;
    }
  }, []);

  const scheduleNextGlitch = useCallback(() => {
    autoTimeoutRef.current = setTimeout(() => {
      setIsGlitching(true);
      animTimeoutRef.current = setTimeout(() => {
        setIsGlitching(false);
        scheduleNextGlitch();
      }, GLITCH_DURATION_MS);
    }, randomDelay());
  }, []);

  useEffect(() => {
    scheduleNextGlitch();
    return clearTimers;
  }, [scheduleNextGlitch, clearTimers]);

  function handleMouseEnter() {
    clearTimers();
    setIsGlitching(true);
  }

  function handleAnimationEnd(event: React.AnimationEvent) {
    if (event.currentTarget === event.target) {
      setIsGlitching(false);
      scheduleNextGlitch();
    }
  }

  const activeClass = isGlitching ? "glitch-active" : "";
  const combinedClassName =
    `glitch-text ${activeClass} ${className}`.trim();

  return (
    <Tag
      className={combinedClassName}
      onMouseEnter={handleMouseEnter}
      onAnimationEnd={handleAnimationEnd}
      style={style}
    >
      <span className="glitch-target chroma">{children}</span>
    </Tag>
  );
}
