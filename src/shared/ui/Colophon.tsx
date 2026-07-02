import type { ReactNode } from "react";
import styles from "./Colophon.module.css";

/** A filed note with a folder tab — used for the "Origin" credit on guides. */
export default function Colophon({ tab, children }: { tab: string; children: ReactNode }) {
  return (
    <aside className={styles.colophon}>
      <span className={styles.tab}>{tab}</span>
      <p className={styles.text}>{children}</p>
    </aside>
  );
}
