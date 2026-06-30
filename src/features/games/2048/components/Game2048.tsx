"use client";

import React from "react";
import Board from "./Board";
import { maxTile } from "../logic/engine";
import { SOLVERS } from "../logic/solvers";
import { MANUAL_SLIDE_MS, SPEEDS, useGame2048 } from "../hooks/useGame2048";
import { useContent } from "@/features/i18n/useContent";
import styles from "./Game2048.module.css";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.g2048Stat}>
      <span className={styles.g2048StatLabel}>{label}</span>
      <span className={styles.g2048StatValue}>{value}</span>
    </div>
  );
}

export default function Game2048() {
  const g = useGame2048();
  const { ui } = useContent();
  const t = ui.game2048;
  const { state } = g;
  const slideMs = g.running ? SPEEDS[g.speedIndex].slideMs : MANUAL_SLIDE_MS;

  return (
    <div className={styles.g2048Layout}>
      {/* ── Board column ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6">
        <div className={styles.g2048Stats}>
          <Stat label={t.stats.score} value={state.score} />
          <Stat label={t.stats.best} value={state.best} />
          <Stat label={t.stats.moves} value={state.moves} />
          <Stat label={t.stats.max} value={maxTile(state)} />
        </div>

        <Board state={state} onRestart={g.reset} onKeepPlaying={g.keepPlaying} slideMs={slideMs} />

        <p className="font-mono text-sm text-muted text-center max-w-100">{t.playHint}</p>
      </div>

      {/* ── Controls column ──────────────────────────────────────────── */}
      <div className={styles.g2048Panel}>
        <h2 className="font-pixel text-sm text-accent-bright mb-1">{t.controls}</h2>

        <div className="flex gap-2">
          <button
            className={`${styles.g2048Btn} flex-1 ${g.running ? styles.g2048BtnActive : styles.g2048BtnPrimary}`}
            onClick={g.toggleRunning}
          >
            {g.running ? t.stop : t.autoSolve}
          </button>
          <button className={styles.g2048Btn} onClick={g.reset}>
            {t.newGame}
          </button>
        </div>

        {/* Solver picker */}
        <div className={styles.g2048Field}>
          <label className={styles.g2048StatLabel}>{t.solverLabel}</label>
          <div className={styles.g2048Segment}>
            {SOLVERS.map((s) => (
              <button
                key={s.id}
                className={styles.g2048SegBtn}
                data-active={g.solver === s.id || undefined}
                onClick={() => g.setSolver(s.id)}
              >
                {t.solvers[s.id].label}
              </button>
            ))}
          </div>
          <p className={`${styles.g2048SolverBlurb} font-mono text-[0.8rem] text-muted leading-snug`}>
            {t.solvers[g.solver].blurb}
          </p>
        </div>

        {/* Speed */}
        <div className={styles.g2048Field}>
          <label className={styles.g2048StatLabel}>
            {t.speedLabel} <span className="text-accent-bright">{SPEEDS[g.speedIndex].label}</span>
          </label>
          <input
            className={styles.g2048Range}
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
        <div className={styles.g2048Field} data-disabled={g.solver !== "montecarlo" || undefined}>
          <label className={styles.g2048StatLabel}>
            {t.rollouts} <span className="text-accent-bright">{g.simulations}</span>
          </label>
          <input
            className={styles.g2048Range}
            type="range"
            min={5}
            max={60}
            step={5}
            value={g.simulations}
            disabled={g.solver !== "montecarlo"}
            onChange={(e) => g.setSimulations(Number(e.target.value))}
          />
          <p className="font-mono text-[0.8rem] text-muted leading-snug">{t.rolloutsHint}</p>
        </div>

        {/* Manual D-pad — handy on touch screens */}
        <div className={styles.g2048Field}>
          <label className={styles.g2048StatLabel}>{t.manual}</label>
          <div className={styles.g2048Dpad}>
            <button className={styles.g2048Btn} onClick={() => g.doMove("up")} disabled={g.running} style={{ gridArea: "u" }}>
              ↑
            </button>
            <button className={styles.g2048Btn} onClick={() => g.doMove("left")} disabled={g.running} style={{ gridArea: "l" }}>
              ←
            </button>
            <button className={styles.g2048Btn} onClick={() => g.doMove("down")} disabled={g.running} style={{ gridArea: "d" }}>
              ↓
            </button>
            <button className={styles.g2048Btn} onClick={() => g.doMove("right")} disabled={g.running} style={{ gridArea: "r" }}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
