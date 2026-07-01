"use client";

import { useState } from "react";
import { EVOLUTIONARY_ALGORITHMS } from "./algorithms/registry";
import styles from "./EvolutionaryProject.module.css";

export default function EvolutionaryProject() {
  const [activeId, setActiveId] = useState(EVOLUTIONARY_ALGORITHMS[0].id);
  const active = EVOLUTIONARY_ALGORITHMS.find((algo) => algo.id === activeId) ?? EVOLUTIONARY_ALGORITHMS[0];
  const ActiveDemo = active.Component;

  return (
    <div className={styles.shell}>
      <nav className={styles.tabs} aria-label="Algorithms">
        {EVOLUTIONARY_ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            type="button"
            onClick={() => setActiveId(algo.id)}
            className={`${styles.tab} ${algo.id === activeId ? styles.tabActive : ""}`}
            aria-pressed={algo.id === activeId}
          >
            {algo.label}
          </button>
        ))}
      </nav>

      <p className={styles.tagline}>{active.tagline}</p>

      <div className={styles.stage}>
        <ActiveDemo />
      </div>
    </div>
  );
}
