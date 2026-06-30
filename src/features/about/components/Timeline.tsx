"use client";

import { type TimelineEntry } from "@/content/about";
import { useContent } from "@/features/i18n/useContent";
import styles from "./Timeline.module.css";

function TimelineCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div className={styles.timelineCard}>
      <span className={`${styles.timelineDate} font-mono`}>{entry.date}</span>
      <h3 className={`${styles.timelineTitle} font-pixel hover-text-glitch text-glitch-soft`}>
        {entry.title}
      </h3>
      {entry.subtitle && (
        <span className={`${styles.timelineSubtitle} font-mono`}>{entry.subtitle}</span>
      )}
      <p className={`${styles.timelineDescription} font-mono`}>{entry.description}</p>
      {entry.tags && entry.tags.length > 0 && (
        <ul className={styles.timelineTags}>
          {entry.tags.map((tag) => (
            <li key={tag} className={`${styles.timelineTag} font-mono`}>
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Timeline() {
  const { about } = useContent();
  return (
    <div className={styles.timelineContainer}>
      <ol className={styles.timelineEntries}>
        {about.timeline.map((entry, index) => {
          const isLeft = index % 2 === 0;
          const num = String(index + 1).padStart(2, "0");
          const milestone = entry.type === "milestone" ? ` ${styles.timelineEntryMilestone}` : "";

          return (
            <li
              key={entry.id}
              className={`${styles.timelineEntry}${milestone} section-reveal`}
            >
              <div
                className={`${styles.timelineSide} ${styles.timelineSideLeft}${isLeft ? "" : ` ${styles.isEmpty}`}`}
              >
                {isLeft && <TimelineCard entry={entry} />}
              </div>

              <div className={styles.timelineNodeCol}>
                <div className={styles.timelineNode}>
                  <span className={`${styles.timelineNodeNum} font-pixel`}>{num}</span>
                  {entry.type === "milestone" && (
                    <span className={styles.timelineNodeDiamond} aria-hidden="true">
                      ◆
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`${styles.timelineSide} ${styles.timelineSideRight}${!isLeft ? "" : ` ${styles.isEmpty}`}`}
              >
                {!isLeft && <TimelineCard entry={entry} />}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
