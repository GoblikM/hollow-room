"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

type ScrollValues = {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
};

type ScrollListener = (values: ScrollValues) => void;

export type ScrollContextValue = {
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void;
  resize: () => void;
  subscribe: (listener: ScrollListener) => () => void;
  getScrollValues: () => ScrollValues;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScroll() {
  return useContext(ScrollContext);
}

export default function ScrollProvider({
  children,
  fixedChildren,
}: {
  children: ReactNode;
  fixedChildren?: ReactNode;
}) {
  const smootherRef = useRef<InstanceType<typeof ScrollSmoother> | null>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const listenersRef = useRef(new Set<ScrollListener>());
  const scrollValuesRef = useRef<ScrollValues>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: prefersReducedMotion ? 0 : 1,
      effects: true,
    });

    const updateValues = () => {
      const smoother = smootherRef.current;
      if (!smoother) return;
      const scroll = smoother.scrollTop();
      const prev = scrollValuesRef.current;

      if (Math.abs(scroll - prev.scroll) < 0.05) return;

      const limit = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const direction = scroll > prev.scroll ? 1 : scroll < prev.scroll ? -1 : prev.direction;
      const velocity = scroll - prev.scroll;
      const progress = scroll / limit;

      scrollValuesRef.current = { scroll, limit, velocity, direction, progress };
      listenersRef.current.forEach((l) => l(scrollValuesRef.current));
    };

    gsap.ticker.add(updateValues);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateValues);
      scrollTweenRef.current?.kill();
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, []);

  const value: ScrollContextValue = {
    scrollTo(target, options = {}) {
      const { offset = 0, duration = 1.4, immediate = false } = options;
      const smoother = smootherRef.current;
      if (!smoother) return;

      let scrollPos: number;
      if (typeof target === "number") {
        scrollPos = target + offset;
      } else {
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        scrollPos = el.getBoundingClientRect().top + smoother.scrollTop() + offset;
      }

      if (immediate || duration <= 0) {
        scrollTweenRef.current?.kill();
        smoother.scrollTo(scrollPos, false);
        return;
      }

      scrollTweenRef.current?.kill();
      scrollTweenRef.current = gsap.to(smoother, {
        scrollTop: scrollPos,
        duration,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    },
    resize() {
      ScrollTrigger.refresh();
    },
    subscribe(listener) {
      listenersRef.current.add(listener);
      listener(scrollValuesRef.current);
      return () => {
        listenersRef.current.delete(listener);
      };
    },
    getScrollValues() {
      return scrollValuesRef.current;
    },
  };

  return (
    <ScrollContext.Provider value={value}>
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
      {fixedChildren}
    </ScrollContext.Provider>
  );
}
