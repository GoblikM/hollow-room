"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import { ABOUT_BIO, ABOUT_HERO, ABOUT_HEADINGS, INTERESTS } from "@/content/about";
import HorizontalTimeline from "@/features/about/components/HorizontalTimeline";
import SkillGrid from "@/features/about/components/SkillGrid";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useTypeHeadingsOnScroll } from "@/hooks/useTypeHeadingsOnScroll";
import { useSnapScroll } from "@/hooks/useSnapScroll";
import { useHorizontalTimelineScroll } from "@/features/about/hooks/useHorizontalTimelineScroll";
import { useScroll } from "@/app/providers/ScrollProvider";
import ScrollArrow from "@/shared/ui/ScrollArrow";
import styles from "./page.module.css";

const GUIDED_FLOW_COMPLETED_KEY = "ui-guided-flow-completed";
const DESKTOP_BREAKPOINT = 768;

export default function AboutPage() {
  const router = useRouter();

  // Start false so the first client render matches the statically-exported HTML
  // (server has no window → mobile layout). The real value is set after mount in
  // the responsive effect below; initialising from window here would hydrate a
  // desktop tree onto server-rendered mobile HTML and mismatch.
  const [isDesktop, setIsDesktop] = useState(false);

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
    setIsDesktop(mq.matches);
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
      <section id="hero" className={styles.aboutHero}>
        <div className={`section-reveal ${styles.aboutHeroInner}`}>
          <div className={`${styles.aboutHeroAvatarFrame} vhs-border`}>
            <Image
              src={avatar}
              alt="Portrait avatar"
              className={styles.aboutHeroAvatar}
              priority
            />
          </div>
          <h1 className={`${styles.aboutHeroTitle} font-pixel text-accent-bright`}>{ABOUT_HERO.title}</h1>
          <p className={`${styles.aboutHeroTagline} font-mono text-muted`}>{ABOUT_HERO.tagline}</p>
          <ScrollArrow />
        </div>
      </section>

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      <section id="bio" className="about-bio section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{ABOUT_HEADINGS.bio}</h2>
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
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{ABOUT_HEADINGS.skills}</h2>
          <SkillGrid />
        </div>
      </section>

      {/* ── Interests ────────────────────────────────────────────────────── */}
      <section id="interests" className="about-interests section section-last">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{ABOUT_HEADINGS.interests}</h2>
          <div className={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <div
                key={interest.label}
                className={`${styles.interestCard} vhs-border section-reveal`}
              >
                <h3 className={`${styles.interestLabel} font-pixel`}>{interest.label}</h3>
                <p className={`${styles.interestDetail} font-mono`}>{interest.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
