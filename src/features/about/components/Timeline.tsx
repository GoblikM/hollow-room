"use client";

import { useRef } from "react";
import { TIMELINE_ENTRIES, type TimelineEntry } from "@/features/about/data/timelineData";
import { useTimelineDrawOnScroll } from "@/hooks/useTimelineDrawOnScroll";

function EntryIcon({ type }: { type: TimelineEntry["type"] }) {
  const icons: Record<TimelineEntry["type"], string> = {
    education: "\u{1F4D6}",
    work: "\u{25B6}",
    milestone: "\u{2605}",
  };
  return <span aria-hidden="true">{icons[type]}</span>;
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const entries = TIMELINE_ENTRIES;
  const entryCount = entries.length;

  useTimelineDrawOnScroll(pathRef, containerRef);

  // Build a vertical SVG path with horizontal jogs at each entry
  const svgHeight = entryCount * 180;
  const segmentHeight = svgHeight / Math.max(entryCount - 1, 1);

  const pathParts: string[] = [`M 20 0`];
  for (let i = 0; i < entryCount; i++) {
    const y = i * segmentHeight;
    // small horizontal jog at each entry dot
    pathParts.push(`L 20 ${y}`);
    if (i < entryCount - 1) {
      pathParts.push(`L 20 ${y + segmentHeight}`);
    }
  }
  const pathD = pathParts.join(" ");

  return (
    <div ref={containerRef} className="timeline-container">
      <svg
        className="timeline-line"
        viewBox={`0 0 40 ${svgHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="var(--color-accent-bright)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <ol className="timeline-entries">
        {entries.map((entry) => (
          <li key={entry.id} className={`timeline-entry timeline-entry-${entry.type} section-reveal`}>
            <div className="timeline-dot" aria-hidden="true">
              <EntryIcon type={entry.type} />
            </div>
            <div className="timeline-entry-content vhs-border">
              <span className="timeline-date font-mono">{entry.date}</span>
              <h3 className="timeline-title font-pixel">{entry.title}</h3>
              {entry.subtitle && (
                <span className="timeline-subtitle font-mono">{entry.subtitle}</span>
              )}
              <p className="timeline-description font-mono">{entry.description}</p>
              {entry.tags && entry.tags.length > 0 && (
                <ul className="timeline-tags">
                  {entry.tags.map((tag) => (
                    <li key={tag} className="timeline-tag font-mono">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
