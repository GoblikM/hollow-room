"use client";

import React from "react";
import { GameState, SIZE } from "./engine";

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
      className="g2048-board"
      role="grid"
      aria-label="2048 board"
      style={{ "--g2048-move-ms": `${slideMs}ms` } as React.CSSProperties}
    >
      {/* Background grid */}
      <div className="g2048-cells" aria-hidden>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <div key={i} className="g2048-cell" />
        ))}
      </div>

      {/* Tiles — keyed by stable id so React reuses nodes and CSS animates moves */}
      <div className="g2048-tiles" aria-hidden>
        {state.tiles.map((t) => (
          <div
            key={t.id}
            className="g2048-tile"
            style={{ "--r": t.row, "--c": t.col } as React.CSSProperties}
          >
            <div
              className="g2048-tile-inner"
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
        <div className="g2048-overlay">
          <p className="font-pixel text-2xl text-accent-bright text-glitch-soft">
            {state.over ? "GAME OVER" : "YOU WIN"}
          </p>
          <div className="flex gap-3">
            {state.won && state.over === false && (
              <button className="g2048-btn" onClick={onKeepPlaying}>
                Keep going
              </button>
            )}
            <button className="g2048-btn g2048-btn-primary" onClick={onRestart}>
              {state.over ? "Try again" : "New game"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
