import React from "react";
import styles from "./ParticleSwarm.module.css";

type Concept = {
  rank: string;
  name: string;
  tagline: string;
  body: React.ReactNode;
};

// How the algorithm works, in plain language — mirrors the 2048 SolverGuide.
const CONCEPTS: Concept[] = [
  {
    rank: "01",
    name: "The swarm",
    tagline: "Candidates on the map",
    body: (
      <>
        Each white dot is a <em>particle</em> — one candidate solution drifting over the landscape. Brighter regions are
        lower (better); the goal is the glowing minimum. The whole swarm searches at once, so many spots get probed in
        parallel.
      </>
    ),
  },
  {
    rank: "02",
    name: "Memory",
    tagline: "pBest & gBest",
    body: (
      <>
        Every particle remembers the best spot <em>it</em> has personally visited (<strong>pBest</strong>). The swarm
        also tracks the best spot found by <em>anyone</em> — <strong>gBest</strong>, the red dot. Those two memories are
        what pull the particles back toward promising ground.
      </>
    ),
  },
  {
    rank: "03",
    name: "The three forces",
    tagline: "Inertia + cognitive + social",
    body: (
      <>
        Each step, a particle&apos;s velocity blends three pulls: <strong>inertia</strong> keeps its current heading,
        the <strong>cognitive</strong> pull draws it toward its own pBest, and the <strong>social</strong> pull draws it
        toward gBest. Balance them and the swarm converges; overdo them and it overshoots and oscillates.
      </>
    ),
  },
  {
    rank: "04",
    name: "Topology",
    tagline: "Who talks to whom",
    body: (
      <>
        <em>Global (star)</em>: everyone follows the single best particle — fast, but the swarm can rush into a local
        minimum together. <em>Ring</em>: a particle only listens to its two neighbours on each side, so good news
        spreads slowly and the swarm explores more before committing.
      </>
    ),
  },
];

type Param = {
  name: string;
  desc: string;
};

const PARAMS: Param[] = [
  { name: "Population", desc: "How many particles search at once. More = broader coverage, slower per step." },
  { name: "Inertia w", desc: "How much of the previous velocity is kept. High = explores wide, low = settles fast." },
  { name: "Cognitive c1", desc: "Strength of the pull toward a particle's own personal best (pBest)." },
  { name: "Social c2", desc: "Strength of the pull toward the swarm's global best (gBest)." },
  { name: "Speed", desc: "Animation pace only — how fast the simulation plays. It does not change the algorithm." },
];

export default function PsoGuide() {
  return (
    <section className={styles.guide} aria-label="How particle swarm optimization works">
      <header className={styles.guideHead}>
        <p className={styles.eyebrow}>The idea</p>
        <h2 className={`${styles.guideTitle} font-pixel text-glitch-soft`}>How the swarm searches</h2>
        <p className={styles.guideSub}>
          Particle Swarm Optimization mimics a flock: simple agents, sharing where they&apos;ve had luck, collectively
          home in on the minimum. Tweak the panel above and watch the behaviour change.
        </p>
      </header>

      <ol className={styles.ladder}>
        {CONCEPTS.map((c) => (
          <li key={c.name} className={styles.entry}>
            <div className={styles.entryRank} aria-hidden>
              {c.rank}
            </div>
            <div>
              <h3 className={styles.entryName}>{c.name}</h3>
              <p className={styles.entryTag}>{c.tagline}</p>
              <p className={styles.entryBody}>{c.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.params}>
        <p className={styles.paramsTitle}>What the controls do</p>
        {PARAMS.map((p) => (
          <div key={p.name} className={styles.param}>
            <span className={styles.paramName}>{p.name}</span>
            <span className={styles.paramDesc}>{p.desc}</span>
          </div>
        ))}
      </div>

      <aside className={styles.colophon}>
        <span className={styles.colophonTab}>Origin</span>
        <p className={styles.colophonText}>
          Built as coursework for a metaheuristics module at university. The algorithm and its test functions began as a{" "}
          <strong>Python notebook</strong> — since ported to TypeScript so the whole swarm runs live, right here in your
          browser.
        </p>
      </aside>
    </section>
  );
}
