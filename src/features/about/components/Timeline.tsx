"use client";

import { TIMELINE_ENTRIES, type TimelineEntry } from "@/features/about/data/timelineData";

function TimelineCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="timeline-card">
      <span className="timeline-date font-mono">{entry.date}</span>
      <h3 className="timeline-title font-pixel hover-text-glitch text-glitch-soft">
        {entry.title}
      </h3>
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
  );
}

export default function Timeline() {
  return (
    <div className="timeline-container">
      <ol className="timeline-entries">
        {TIMELINE_ENTRIES.map((entry, index) => {
          const isLeft = index % 2 === 0;
          const num = String(index + 1).padStart(2, "0");

          return (
            <li
              key={entry.id}
              className={`timeline-entry timeline-entry-${entry.type} section-reveal`}
            >
              <div className={`timeline-side timeline-side-left${isLeft ? "" : " is-empty"}`}>
                {isLeft && <TimelineCard entry={entry} />}
              </div>

              <div className="timeline-node-col">
                <div className="timeline-node">
                  <span className="timeline-node-num font-pixel">{num}</span>
                  {entry.type === "milestone" && (
                    <span className="timeline-node-diamond" aria-hidden="true">
                      ◆
                    </span>
                  )}
                </div>
              </div>

              <div className={`timeline-side timeline-side-right${!isLeft ? "" : " is-empty"}`}>
                {!isLeft && <TimelineCard entry={entry} />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
