"use client";

import { useContent } from "@/features/i18n/useContent";
import styles from "../EvolutionaryProject.module.css";

/** Temporary stand-in until each algorithm's real visualization is ported
 *  from the source notebooks. */
export default function Placeholder(_props: { name?: string }) {
  const { ui } = useContent();
  return (
    <div className={styles.placeholder}>
      <p className={styles.placeholderHint}>{ui.misc.comingSoon}</p>
    </div>
  );
}
