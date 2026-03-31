"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import { ABOUT_BIO, ABOUT_TAGLINE } from "@/features/about/data/bioContent";
import { INTERESTS } from "@/features/about/data/interestsData";
import HorizontalTimeline from "@/features/about/components/HorizontalTimeline";
import SkillGrid from "@/features/about/components/SkillGrid";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTypeHeadingsOnScroll } from "@/hooks/useTypeHeadingsOnScroll";
import { useSnapScroll } from "@/hooks/useSnapScroll";
import { useHorizontalTimelineScroll } from "@/hooks/useHorizontalTimelineScroll";
import { useScroll } from "@/app/providers/ScrollProvider";
import ScrollArrow from "@/shared/ui/ScrollArrow";

const GUIDED_FLOW_COMPLETED_KEY = "ui-guided-flow-completed";
const DESKTOP_BREAKPOINT = 768;

export default function AboutPage() {
  const router = useRouter();

  // Synchronous init avoids a layout flash on first paint.
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  });

  const { scrollTo, getScrollValues } = useScroll();

  // Holds DOM refs for dot step indicators inside HorizontalTimeline.
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Guided-flow guard ─────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem(GUIDED_FLOW_COMPLETED_KEY) !== "1") {
      router.replace("/#about");
    }
  }, [router]);

  // ── Responsive detection ───────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Dot indicator update (DOM-direct, no re-render) ─────────────────────────
  function handleTimelineUpdate(currentIndex: number) {
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      dot.classList.toggle("tl-dot--active", i === currentIndex);
    });
  }

  // ── Horizontal timeline scroll (desktop only) ──────────────────────────────
  const {
    sectionRef: timelineSectionRef,
    trackRef: timelineTrackRef,
    progressRef: timelineProgressRef,
    canLeavePrev: timelineCanLeavePrev,
    canLeaveNext: timelineCanLeaveNext,
    scrollBy: timelineScrollBy,
    stepTo: timelineStepTo,
  } = useHorizontalTimelineScroll({
    disabled: !isDesktop,
    onUpdate: handleTimelineUpdate,
  });

  // ── Snap scroll (desktop only) ─────────────────────────────────────────────
  useSnapScroll({
    minWidth: DESKTOP_BREAKPOINT,
    getScrollY: () => getScrollValues().scroll,
    scrollTo: (y) => scrollTo(y, { duration: 1.0 }),
    canSnapOverride(dir, section) {
      if (section.id !== "timeline") return null;
      return dir > 0 ? timelineCanLeaveNext.current : timelineCanLeavePrev.current;
    },
  });

  // ── Reveal & typing animations ─────────────────────────────────────────────
  useRevealOnScroll();
  useTypeHeadingsOnScroll(".about-page .section-reveal h2", 28);

  return (
    <main className="page-content about-page about-snap-layout">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="about-hero">
        <div className="section-reveal about-hero-inner">
          <div className="about-hero-avatar-frame vhs-border">
            <Image
              src={avatar}
              alt="Portrait avatar"
              className="about-hero-avatar"
              priority
            />
          </div>
          <h1 className="about-hero-title font-pixel text-accent-bright">about me</h1>
          <p className="about-hero-tagline font-mono text-muted">{ABOUT_TAGLINE}</p>
          <ScrollArrow />
        </div>
      </section>

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      <section id="bio" className="about-bio section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">who am I</h2>
          <div className="about-bio-text">
            {ABOUT_BIO.map((paragraph, i) => (
              <p key={i} className="font-mono text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <HorizontalTimeline
        isDesktop={isDesktop}
        sectionRef={timelineSectionRef}
        trackRef={timelineTrackRef}
        progressRef={timelineProgressRef}
        dotsRef={dotsRef}
        onPrev={() => timelineScrollBy(-1)}
        onNext={() => timelineScrollBy(1)}
        onStepTo={timelineStepTo}
      />

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <section id="skills" className="about-skills section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">tech stack</h2>
          <SkillGrid />
        </div>
      </section>

      {/* ── Interests ────────────────────────────────────────────────────── */}
      <section id="interests" className="about-interests section section-last">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">interests</h2>
          <div className="interests-grid">
            {INTERESTS.map((interest) => (
              <div
                key={interest.label}
                className="interest-card vhs-border section-reveal"
              >
                <h3 className="interest-label font-pixel">{interest.label}</h3>
                <p className="interest-detail font-mono">{interest.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
