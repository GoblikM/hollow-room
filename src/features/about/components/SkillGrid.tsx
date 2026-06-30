"use client";

import { useContent } from "@/features/i18n/useContent";
import styles from "./SkillGrid.module.css";

export default function SkillGrid() {
  const { about } = useContent();
  return (
    <div className={styles.skillGrid}>
      {about.skills.map((category) => (
        <div key={category.name} className={`${styles.skillCard} pixel-border section-reveal`}>
          <h3 className={`${styles.skillCardTitle} font-pixel`}>{category.name}</h3>
          <ul className={styles.skillChips}>
            {category.skills.map((skill) => (
              <li key={skill} className={`${styles.skillChip} font-mono`}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
