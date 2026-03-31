"use client";

import { type RefObject } from "react";
import { TIMELINE_ENTRIES, type TimelineEntry, type TimelineEntryType } from "@/features/about/data/timelineData";
import Timeline from "@/features/about/components/Timeline";

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

  return (
    <div
      className={`tl-entry tl-entry-${entry.type}`}
      role="listitem"
      aria-label={`${entry.date} — ${entry.title}`}
    >
      {/* Left: number, type, date */}
      <div className="tl-entry-left">
        <span className="tl-entry-num font-pixel">{num}</span>
        <span className={`tl-entry-type tl-entry-type-${entry.type} font-mono`}>
          {TYPE_LABELS[entry.type]}
        </span>
        <time className="tl-entry-date font-mono">{entry.date}</time>
      </div>

      {/* Vertical divider with accent node */}
      <div className="tl-entry-divider" aria-hidden="true" />

      {/* Right: content */}
      <div className="tl-entry-right">
        <h3 className="tl-entry-title font-pixel hover-text-glitch text-glitch-soft">
          {entry.title}
        </h3>
        {entry.subtitle && (
          <span className="tl-entry-subtitle font-mono">{entry.subtitle}</span>
        )}
        <p className="tl-entry-desc font-mono">{entry.description}</p>
        {entry.tags && entry.tags.length > 0 && (
          <ul className="tl-entry-tags" aria-label="Technologies">
            {entry.tags.map((tag) => (
              <li key={tag} className="tl-entry-tag font-mono">
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
      className="about-timeline-section"
      aria-label="Career timeline"
    >
      <div className="max-w-200 w-full tl-wrapper">
        {/* Header */}
        <header className="tl-header section-reveal">
          <h2 className="font-pixel text-5xl text-accent-bright">timeline</h2>
          <p className="tl-hint font-mono">scroll to advance →</p>
        </header>

        {/* Track area — one entry visible at a time */}
        <div className="tl-track-outer">
          <div className="tl-track" ref={trackRef} role="list">
            {TIMELINE_ENTRIES.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>

        {/* Footer: prev/next + dot indicators */}
        <footer className="tl-footer">
          <button
            className="tl-nav-btn font-mono"
            aria-label="Previous timeline entry"
            onClick={onPrev}
          >
            ←
          </button>

          <div className="tl-dots" role="tablist" aria-label="Timeline entries">
            {TIMELINE_ENTRIES.map((_, i) => (
              <button
                key={i}
                ref={(el) => { dotsRef.current[i] = el; }}
                className="tl-dot"
                role="tab"
                aria-label={`Entry ${i + 1}`}
                onClick={() => onStepTo(i)}
              />
            ))}
          </div>

          {/* Hidden div for GSAP progressRef — not rendered visually */}
          <div ref={progressRef} className="tl-progress-fill" aria-hidden="true" />

          <button
            className="tl-nav-btn font-mono"
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
