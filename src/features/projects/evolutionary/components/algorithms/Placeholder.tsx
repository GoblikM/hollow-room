import styles from "../EvolutionaryProject.module.css";

/** Temporary stand-in until each algorithm's real visualization is ported
 *  from the source notebooks. */
export default function Placeholder({ name }: { name: string }) {
  return (
    <div className={styles.placeholder}>
      <p className={styles.placeholderHint}>Coming soon!!</p>
    </div>
  );
}
