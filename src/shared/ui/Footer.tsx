"use client";

import { useContent } from "@/features/i18n/useContent";
import styles from "./Footer.module.css";

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";

export default function Footer() {
  const { ui } = useContent();
  return (
    <footer className={`${styles.footerSection} p-4 text-center font-pixel text-accent-bright text-xs`}>
      &copy; 2026 hollow-room. {ui.footer.rights}{" "}
      <span className="text-muted text-[0.65rem] tracking-[0.08em]">v{appVersion}</span>
    </footer>
  );
}
