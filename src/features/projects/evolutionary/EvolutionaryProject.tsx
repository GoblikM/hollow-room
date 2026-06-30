"use client";

import { useState } from "react";
import { ALGORITHM_COMPONENTS } from "./algorithms";
import { useContent } from "@/features/i18n/useContent";
import styles from "./EvolutionaryProject.module.css";

export default function EvolutionaryProject() {
  const { projects, ui } = useContent();
  const algorithms = projects.algorithms;
  const [activeId, setActiveId] = useState(algorithms[0].id);
  const active = algorithms.find((algo) => algo.id === activeId) ?? algorithms[0];
  const ActiveDemo = ALGORITHM_COMPONENTS[active.id];

  return (
    <div className={styles.shell}>
      <nav className={styles.tabs} aria-label={ui.misc.algorithms}>
        {algorithms.map((algo) => (
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
        {ActiveDemo && <ActiveDemo />}
      </div>
    </div>
  );
}
