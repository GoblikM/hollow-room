import React from "react";
import GuideHeader from "@/shared/ui/GuideHeader";
import Colophon from "@/shared/ui/Colophon";
import styles from "./Game2048.module.css";

type Method = {
  rank: string;
  name: string;
  tagline: string;
  body: React.ReactNode;
  avgScore: string;
  /** Representative best tile, rendered in the game's own tile style. */
  peakTile: number;
  /** How often it actually reaches 2048, as 1–3 filled pips. */
  reach: number;
  reachLabel: string;
};

// Figures are the averages reported by the original notebook (30 games each).
const METHODS: Method[] = [
  {
    rank: "01",
    name: "Random",
    tagline: "Blind luck",
    body: (
      <>
        Every turn it picks one of the currently legal moves at random — no look-ahead, no strategy. It earns its place
        as the yardstick: whatever a real method does, it should comfortably beat this. Tiles scatter, the board clogs,
        and it never gets close to 2048.
      </>
    ),
    avgScore: "1 100",
    peakTile: 128,
    reach: 1,
    reachLabel: "Never reaches 2048",
  },
  {
    rank: "02",
    name: "Greedy corner",
    tagline: "A fixed habit",
    body: (
      <>
        A tiny rule-based player that always tries the same move order — leaning on <em>left</em> and <em>up</em>,
        dropping to <em>down</em> and <em>right</em> only when forced. That bias pins the biggest tiles into one corner,
        the oldest trick in the book. No searching, yet it roughly triples the random score.
      </>
    ),
    avgScore: "2 850",
    peakTile: 256,
    reach: 2,
    reachLabel: "Reaches 2048 rarely",
  },
  {
    rank: "03",
    name: "Monte Carlo",
    tagline: "Plays the odds",
    body: (
      <>
        For each candidate move it plays out dozens of fast, fully random games and averages the final scores. The move
        with the brightest random futures wins. It never &quot;understands&quot; the board — it just lets statistics
        speak — but it&apos;s strong enough to reach 2048 outright. Use the rollouts slider to trade speed for strength.
      </>
    ),
    avgScore: "18 000",
    peakTile: 2048,
    reach: 3,
    reachLabel: "Reaches 2048 often",
  },
];

export default function SolverGuide() {
  return (
    <section className={styles.g2048Guide} aria-label="How the solvers work">
      <GuideHeader
        eyebrow="The field"
        title="How the solvers think"
        subtitle={
          <>
            Three ways to play the same game — from blind luck to statistical brute force. Pick one in the panel above
            and watch the gap widen.
          </>
        }
      />

      <ol className={styles.g2048Ladder}>
        {METHODS.map((m) => (
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
                  <span className={`${styles.g2048MetricLabel} font-pixel`}>Avg score</span>
                  <span className={`${styles.g2048MetricValue} font-mono`}>{m.avgScore}</span>
                </div>
                <div className={styles.g2048Metric}>
                  <span className={`${styles.g2048MetricLabel} font-pixel`}>2048 rate</span>
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
              <span className={`${styles.g2048PeakLabel} font-pixel`}>Typical peak</span>
            </div>
          </li>
        ))}
      </ol>

      <Colophon tab="Origin">
        Built as coursework for my <strong>Soft Computing &amp; Data Mining</strong> module at university. The game logic
        and all three solvers began life as a Python notebook — since ported to TypeScript so the whole thing runs live,
        right here in your browser.
      </Colophon>
    </section>
  );
}
