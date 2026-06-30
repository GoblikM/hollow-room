"use client";

import { type RefObject } from "react";
import { TIMELINE_ENTRIES, type TimelineEntry, type TimelineEntryType } from "@/content/about";
import Timeline from "@/features/about/components/Timeline";
import styles from "./HorizontalTimeline.module.css";

// ── Helpers ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<TimelineEntryType, string> = {
  education: "education",
  work: "work",
  milestone: "milestone",
};

// ── Single entry ───────────────────────────────────────────────────────────

function TimelineEntry({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const isMilestone = entry.type === "milestone";

  return (
    <div
      className={`${styles.tlEntry}${isMilestone ? ` ${styles.tlEntryMilestone}` : ""}`}
      role="listitem"
      aria-label={`${entry.date} — ${entry.title}`}
    >
      {/* Left: number, type, date */}
      <div className={styles.tlEntryLeft}>
        <span className={`${styles.tlEntryNum} font-pixel`}>{num}</span>
        <span className={`${styles.tlEntryType}${isMilestone ? ` ${styles.tlEntryTypeMilestone}` : ""} font-mono`}>
          {TYPE_LABELS[entry.type]}
        </span>
        <time className={`${styles.tlEntryDate} font-mono`}>{entry.date}</time>
      </div>

      {/* Vertical divider with accent node */}
      <div className={styles.tlEntryDivider} aria-hidden="true" />

      {/* Right: content */}
      <div className={styles.tlEntryRight}>
        <h3 className={`${styles.tlEntryTitle} font-pixel hover-text-glitch text-glitch-soft`}>
          {entry.title}
        </h3>
        {entry.subtitle && (
          <span className={`${styles.tlEntrySubtitle} font-mono`}>{entry.subtitle}</span>
        )}
        <p className={`${styles.tlEntryDesc} font-mono`}>{entry.description}</p>
        {entry.tags && entry.tags.length > 0 && (
          <ul className={styles.tlEntryTags} aria-label="Technologies">
            {entry.tags.map((tag) => (
              <li key={tag} className={`${styles.tlEntryTag} font-mono`}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Desktop horizontal layout ──────────────────────────────────────────────

type DesktopProps = {
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
  dotsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onPrev: () => void;
  onNext: () => void;
  onStepTo: (index: number) => void;
};

function DesktopTimeline({
  sectionRef,
  trackRef,
  progressRef,
  dotsRef,
  onPrev,
  onNext,
  onStepTo,
}: DesktopProps) {
  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={styles.aboutTimelineSection}
      aria-label="Career timeline"
    >
      <div className={`max-w-200 w-full ${styles.tlWrapper}`}>
        {/* Header — no section-reveal: this desktop subtree mounts after the
            reveal pass has run (isDesktop flips post-mount), so it would stay
            stuck in the blurred initial state. The entries animate on scroll. */}
        <header className={styles.tlHeader}>
          <h2 className="font-pixel text-5xl text-accent-bright">timeline</h2>
          <p className={`${styles.tlHint} font-mono`}>scroll to advance →</p>
        </header>

        {/* Track area — one entry visible at a time */}
        <div className={styles.tlTrackOuter}>
          <div className={styles.tlTrack} ref={trackRef} role="list">
            {TIMELINE_ENTRIES.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>

        {/* Footer: prev/next + dot indicators */}
        <footer className={styles.tlFooter}>
          <button
            className={`${styles.tlNavBtn} font-mono`}
            aria-label="Previous timeline entry"
            onClick={onPrev}
          >
            ←
          </button>

          <div className={styles.tlDots} role="tablist" aria-label="Timeline entries">
            {TIMELINE_ENTRIES.map((_, i) => (
              <button
                key={i}
                ref={(el) => { dotsRef.current[i] = el; }}
                className={styles.tlDot}
                role="tab"
                aria-label={`Entry ${i + 1}`}
                onClick={() => onStepTo(i)}
              />
            ))}
          </div>

          {/* Hidden div for GSAP progressRef — not rendered visually */}
          <div ref={progressRef} className={styles.tlProgressFill} aria-hidden="true" />

          <button
            className={`${styles.tlNavBtn} font-mono`}
            aria-label="Next timeline entry"
            onClick={onNext}
          >
            →
          </button>
        </footer>
      </div>
    </section>
  );
}

// ── Mobile vertical fallback ───────────────────────────────────────────────

function MobileTimeline() {
  return (
    <section id="timeline" className="about-timeline section">
      <div className="section-reveal max-w-200 w-full">
        <h2 className="font-pixel text-5xl mb-10 text-accent-bright">timeline</h2>
        <Timeline />
      </div>
    </section>
  );
}

// ── Public component ───────────────────────────────────────────────────────

type HorizontalTimelineProps = {
  isDesktop: boolean;
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
  dotsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onPrev: () => void;
  onNext: () => void;
  onStepTo: (index: number) => void;
};

export default function HorizontalTimeline(props: HorizontalTimelineProps) {
  const { isDesktop, ...rest } = props;

  if (!isDesktop) {
    return <MobileTimeline />;
  }

  return <DesktopTimeline {...rest} />;
}
