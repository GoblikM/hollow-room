"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/features/i18n/useContent";
import styles from "./NightmareSwarm.module.css";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The Unity WebGL build ships its own loader/index.html under public/. We embed
// it in an iframe so the engine's own loader runs unchanged. Point at the
// directory (trailing slash, no index.html): Vercel serves the dir but 404s an
// explicit /index.html, and the trailing slash keeps the build's relative asset
// paths resolving correctly on both Vercel and GitHub Pages.
const BUILD_URL = `${PUBLIC_BASE_PATH}/ns_web_build/`;

// Injected into the iframe document after it loads so the Unity canvas fills the
// frame and no scrollbars appear. Done from here (not the build's index.html) so
// it survives re-exporting the game and recopying the build folder.
const EMBED_CSS = `
  html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #242725; }
  #unity-canvas { width: 100% !important; height: 100% !important; }
`;

export default function NightmareSwarm() {
  const { ui } = useContent();
  const ns = ui.nightmareSwarm;
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function injectEmbedStyles() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const style = doc.createElement("style");
    style.textContent = EMBED_CSS;
    doc.head.appendChild(style);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      frameRef.current?.requestFullscreen();
    }
  }

  return (
    <div className={styles.wrapper}>
      <div ref={frameRef} className={`${styles.frame} vhs-border`}>
        <iframe
          ref={iframeRef}
          src={BUILD_URL}
          title="Nightmare Swarm"
          className={styles.embed}
          allow="fullscreen; autoplay"
          allowFullScreen
          onLoad={injectEmbedStyles}
        />
        <button
          type="button"
          onClick={toggleFullscreen}
          className={styles.fullscreenBtn}
          aria-label={isFullscreen ? ns.fullscreenExit : ns.fullscreenEnter}
          title={isFullscreen ? ns.fullscreenExit : ns.fullscreenEnter}
        >
          {isFullscreen ? "✕" : "⛶"}
        </button>
      </div>

      <section className={styles.controls} aria-label={ns.controlsTitle}>
        <h2 className={`${styles.controlsTitle} font-pixel text-glitch-soft`}>{ns.controlsTitle}</h2>
        <ul className={styles.controlsList}>
          {ns.controls.map((c) => (
            <li key={c.action} className={styles.controlRow}>
              <span className={`${styles.controlAction} font-mono`}>{c.action}</span>
              <span className={styles.keys}>
                {c.keys.map((k) => (
                  <kbd key={k} className={`${styles.key} font-pixel`}>
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <aside className={styles.colophon}>
        <span className={`${styles.colophonTab} font-pixel`}>{ns.originTab}</span>
        <p className={`${styles.colophonText} font-mono`}>{ns.originText}</p>
      </aside>
    </div>
  );
}
