"use client";

import React from "react";
import { GameState, SIZE } from "../logic/engine";
import styles from "./Game2048.module.css";

type BoardProps = {
  state: GameState;
  onRestart: () => void;
  onKeepPlaying: () => void;
  /** Tile-slide duration in ms — shorter while auto-solving fast. */
  slideMs: number;
};

/** Tiles above 2048 reuse the brightest styling via the data-value cap. */
function valueAttr(value: number): number {
  return Math.min(value, 4096);
}

export default function Board({ state, onRestart, onKeepPlaying, slideMs }: BoardProps) {
  const finished = state.over || (state.won && !state.keepPlaying);

  return (
    <div
      className={styles.g2048Board}
      role="grid"
      aria-label="2048 board"
      style={{ "--g2048-move-ms": `${slideMs}ms` } as React.CSSProperties}
    >
      {/* Background grid */}
      <div className={styles.g2048Cells} aria-hidden>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <div key={i} className={styles.g2048Cell} />
        ))}
      </div>

      {/* Tiles — keyed by stable id so React reuses nodes and CSS animates moves */}
      <div className={styles.g2048Tiles} aria-hidden>
        {state.tiles.map((t) => (
          <div
            key={t.id}
            className={styles.g2048Tile}
            style={{ "--r": t.row, "--c": t.col } as React.CSSProperties}
          >
            <div
              className={styles.g2048TileInner}
              data-value={valueAttr(t.value)}
              data-new={t.isNew || undefined}
              data-merged={t.merged || undefined}
            >
              {t.value}
            </div>
          </div>
        ))}
      </div>

      {finished && (
        <div className={styles.g2048Overlay}>
          <p className="font-pixel text-2xl text-accent-bright text-glitch-soft">
            {state.over ? "GAME OVER" : "YOU WIN"}
          </p>
          <div className="flex gap-3">
            {state.won && state.over === false && (
              <button className={styles.g2048Btn} onClick={onKeepPlaying}>
                Keep going
              </button>
            )}
            <button className={`${styles.g2048Btn} ${styles.g2048BtnPrimary}`} onClick={onRestart}>
              {state.over ? "Try again" : "New game"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
