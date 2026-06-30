"use client";

import { useContent } from "@/features/i18n/useContent";
import styles from "./Game2048.module.css";

export default function SolverGuide() {
  const { ui } = useContent();
  const s = ui.solver;

  return (
    <section className={styles.g2048Guide} aria-label={s.title}>
      <header className={styles.g2048GuideHead}>
        <p className={styles.g2048Eyebrow}>{s.eyebrow}</p>
        <h2 className={`${styles.g2048GuideTitle} font-pixel text-glitch-soft`}>{s.title}</h2>
        <p className={styles.g2048GuideSub}>{s.sub}</p>
      </header>

      <ol className={styles.g2048Ladder}>
        {s.methods.map((m) => (
          <li key={m.name} className={styles.g2048Entry}>
            <div className={`${styles.g2048EntryRank} font-pixel`} aria-hidden>
              {m.rank}
            </div>

            <div>
              <h3 className={`${styles.g2048EntryName} font-heading`}>{m.name}</h3>
              <p className={`${styles.g2048EntryTag} font-pixel`}>{m.tagline}</p>
              <p className={`${styles.g2048EntryBody} font-mono`}>{m.body}</p>

              <div className={styles.g2048EntryMeta}>
                <div className={styles.g2048Metric}>
                  <span className={`${styles.g2048MetricLabel} font-pixel`}>{s.avgScore}</span>
                  <span className={`${styles.g2048MetricValue} font-mono`}>{m.avgScore}</span>
                </div>
                <div className={styles.g2048Metric}>
                  <span className={`${styles.g2048MetricLabel} font-pixel`}>{s.reach2048}</span>
                  <span className={styles.g2048Pips} role="img" aria-label={m.reachLabel}>
                    {[0, 1, 2].map((i) => (
                      <i key={i} data-on={i < m.reach || undefined} />
                    ))}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.g2048EntryPeak}>
              <div className={styles.g2048GuideTile} aria-hidden>
                <div className={styles.g2048TileInner} data-value={m.peakTile}>
                  {m.peakTile}
                </div>
              </div>
              <span className={`${styles.g2048PeakLabel} font-pixel`}>{s.typicalPeak}</span>
            </div>
          </li>
        ))}
      </ol>

      <aside className={styles.g2048Colophon}>
        <span className={`${styles.g2048ColophonTab} font-pixel`}>{s.originTab}</span>
        <p className={`${styles.g2048ColophonText} font-mono`}>{s.originText}</p>
      </aside>
    </section>
  );
}
