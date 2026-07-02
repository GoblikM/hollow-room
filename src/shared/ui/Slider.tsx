import type { InputHTMLAttributes } from "react";
import styles from "./Slider.module.css";

/** Themed range slider shared across features (2048, evolutionary…). */
export default function Slider({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="range" className={`${styles.range} ${className ?? ""}`} {...props} />;
}
