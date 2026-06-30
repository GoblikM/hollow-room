"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NightmareSwarm.module.css";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The Unity WebGL build ships its own loader/index.html under public/. We embed
// it in an iframe so the engine's own loader runs unchanged.
const BUILD_URL = `${PUBLIC_BASE_PATH}/ns_web_build/index.html`;

// Injected into the iframe document after it loads so the Unity canvas fills the
// frame and no scrollbars appear. Done from here (not the build's index.html) so
// it survives re-exporting the game and recopying the build folder.
const EMBED_CSS = `
  html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #242725; }
  #unity-canvas { width: 100% !important; height: 100% !important; }
`;

export default function NightmareSwarm() {
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
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? "✕" : "⛶"}
      </button>
    </div>
  );
}
