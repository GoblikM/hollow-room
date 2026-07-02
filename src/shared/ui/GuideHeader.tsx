import type { ReactNode } from "react";
import styles from "./GuideHeader.module.css";

/** Centered guide heading: eyebrow + glitch title + subtitle. Shared across features. */
export default function GuideHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <header className={styles.head}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={`${styles.title} font-pixel text-glitch-soft`}>{title}</h2>
      <p className={styles.sub}>{subtitle}</p>
    </header>
  );
}
