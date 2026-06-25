"use client";

import React from "react";
import Board from "./Board";
import { maxTile } from "./engine";
import { SOLVERS } from "./solvers";
import { MANUAL_SLIDE_MS, SPEEDS, useGame2048 } from "./useGame2048";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="g2048-stat">
      <span className="g2048-stat-label">{label}</span>
      <span className="g2048-stat-value">{value}</span>
    </div>
  );
}

export default function Game2048() {
  const g = useGame2048();
  const { state } = g;
  const slideMs = g.running ? SPEEDS[g.speedIndex].slideMs : MANUAL_SLIDE_MS;

  return (
    <div className="g2048-layout">
      {/* ── Board column ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6">
        <div className="g2048-stats">
          <Stat label="Score" value={state.score} />
          <Stat label="Best" value={state.best} />
          <Stat label="Moves" value={state.moves} />
          <Stat label="Max" value={maxTile(state)} />
        </div>

        <Board state={state} onRestart={g.reset} onKeepPlaying={g.keepPlaying} slideMs={slideMs} />

        <p className="font-mono text-sm text-muted text-center max-w-100">
          Use <span className="text-accent-bright">arrow keys</span> or{" "}
          <span className="text-accent-bright">WASD</span> to play. Auto-solving disables manual input.
        </p>
      </div>

      {/* ── Controls column ──────────────────────────────────────────── */}
      <div className="g2048-panel">
        <h2 className="font-pixel text-sm text-accent-bright mb-1">Controls</h2>

        <div className="flex gap-2">
          <button
            className={`g2048-btn flex-1 ${g.running ? "g2048-btn-active" : "g2048-btn-primary"}`}
            onClick={g.toggleRunning}
          >
            {g.running ? "■ Stop" : "▶ Auto-solve"}
          </button>
          <button className="g2048-btn" onClick={g.reset}>
            ↻ New
          </button>
        </div>

        {/* Solver picker */}
        <div className="g2048-field">
          <label className="g2048-stat-label">Solver</label>
          <div className="g2048-segment">
            {SOLVERS.map((s) => (
              <button
                key={s.id}
                className="g2048-seg-btn"
                data-active={g.solver === s.id || undefined}
                onClick={() => g.setSolver(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="g2048-solver-blurb font-mono text-[0.8rem] text-muted leading-snug">
            {SOLVERS.find((s) => s.id === g.solver)?.blurb}
          </p>
        </div>

        {/* Speed */}
        <div className="g2048-field">
          <label className="g2048-stat-label">
            Speed <span className="text-accent-bright">{SPEEDS[g.speedIndex].label}</span>
          </label>
          <input
            className="g2048-range"
            type="range"
            min={0}
            max={SPEEDS.length - 1}
            step={1}
            value={g.speedIndex}
            onChange={(e) => g.setSpeedIndex(Number(e.target.value))}
          />
        </div>

        {/* Monte Carlo simulations — always rendered so the panel height stays
            stable; disabled unless the Monte Carlo solver is active. */}
        <div className="g2048-field" data-disabled={g.solver !== "montecarlo" || undefined}>
          <label className="g2048-stat-label">
            Rollouts / move <span className="text-accent-bright">{g.simulations}</span>
          </label>
          <input
            className="g2048-range"
            type="range"
            min={5}
            max={60}
            step={5}
            value={g.simulations}
            disabled={g.solver !== "montecarlo"}
            onChange={(e) => g.setSimulations(Number(e.target.value))}
          />
          <p className="font-mono text-[0.8rem] text-muted leading-snug">
            More rollouts play smarter but think slower. Monte Carlo only.
          </p>
        </div>

        {/* Manual D-pad — handy on touch screens */}
        <div className="g2048-field">
          <label className="g2048-stat-label">Manual</label>
          <div className="g2048-dpad">
            <button className="g2048-btn" onClick={() => g.doMove("up")} disabled={g.running} style={{ gridArea: "u" }}>
              ↑
            </button>
            <button className="g2048-btn" onClick={() => g.doMove("left")} disabled={g.running} style={{ gridArea: "l" }}>
              ←
            </button>
            <button className="g2048-btn" onClick={() => g.doMove("down")} disabled={g.running} style={{ gridArea: "d" }}>
              ↓
            </button>
            <button className="g2048-btn" onClick={() => g.doMove("right")} disabled={g.running} style={{ gridArea: "r" }}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
