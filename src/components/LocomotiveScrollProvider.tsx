"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type {
  ILenisScrollToOptions,
  ILenisScrollValues,
  lenisTargetScrollTo,
} from "locomotive-scroll";

type ScrollListener = (values: ILenisScrollValues) => void;

type ScrollContextValue = {
  scrollTo: (
    target: lenisTargetScrollTo,
    options?: ILenisScrollToOptions
  ) => void;
  resize: () => void;
  subscribe: (listener: ScrollListener) => () => void;
  getScrollValues: () => ILenisScrollValues;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useLocomotiveScroll() {
  return useContext(ScrollContext);
}

type LocomotiveScrollProviderProps = {
  children: ReactNode;
};

export default function LocomotiveScrollProvider({
  children,
}: LocomotiveScrollProviderProps) {
  const instanceRef = useRef<InstanceType<
    typeof import("locomotive-scroll").default
  > | null>(null);
  const listenersRef = useRef(new Set<ScrollListener>());
  const scrollValuesRef = useRef<ILenisScrollValues>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function initializeScroll() {
      const { default: LocomotiveScroll } = await import("locomotive-scroll");

      if (cancelled) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      instanceRef.current = new LocomotiveScroll({
        lenisOptions: {
          smoothWheel: !prefersReducedMotion,
          syncTouch: false,
          lerp: prefersReducedMotion ? 1 : 0.12,
        },
        scrollCallback(values) {
          scrollValuesRef.current = values;
          listenersRef.current.forEach((listener) => {
            listener(values);
          });
        },
      });

      instanceRef.current.resize();
      listenersRef.current.forEach((listener) => {
        listener(scrollValuesRef.current);
      });
    }

    void initializeScroll();

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  const value: ScrollContextValue = {
    scrollTo(target, options) {
      instanceRef.current?.scrollTo(target, options);
    },
    resize() {
      instanceRef.current?.resize();
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
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}
