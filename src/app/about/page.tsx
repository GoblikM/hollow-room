"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import { useContent } from "@/features/i18n/useContent";
import { useLang } from "@/features/i18n/LanguageProvider";
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
const DESKTOP_QUERY = `(min-width: ${DESKTOP_BREAKPOINT}px)`;

// Read the desktop/mobile breakpoint as an external store. useSyncExternalStore
// hydrates with the server snapshot (false → mobile, matching the static HTML)
// then resyncs to the real value — no hydration mismatch, and no setState in an
// effect.
function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
const getDesktopSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
const getDesktopServerSnapshot = () => false;

export default function AboutPage() {
  const router = useRouter();

  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getDesktopServerSnapshot);

  const { about } = useContent();
  const lang = useLang();
  const { scrollTo, getScrollValues } = useScroll();

  // Holds DOM refs for dot step indicators inside HorizontalTimeline.
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Guided-flow guard ─────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem(GUIDED_FLOW_COMPLETED_KEY) !== "1") {
      router.replace("/#about");
    }
  }, [router]);

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
  useRevealOnScroll(".section-reveal", lang);
  useTypeHeadingsOnScroll(".about-page .section-reveal h2", 28, lang);

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
          <h1 className={`${styles.aboutHeroTitle} font-pixel text-accent-bright`}>{about.hero.title}</h1>
          <p className={`${styles.aboutHeroTagline} font-mono text-muted`}>{about.hero.tagline}</p>
          <ScrollArrow />
        </div>
      </section>

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      <section id="bio" className="about-bio section">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{about.headings.bio}</h2>
          <div className="about-bio-text">
            {about.bio.map((paragraph, i) => (
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
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{about.headings.skills}</h2>
          <SkillGrid />
        </div>
      </section>

      {/* ── Interests ────────────────────────────────────────────────────── */}
      <section id="interests" className="about-interests section section-last">
        <div className="section-reveal max-w-200 w-full">
          <h2 className="font-pixel text-5xl mb-10 text-accent-bright">{about.headings.interests}</h2>
          <div className={styles.interestsGrid}>
            {about.interests.map((interest) => (
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
