"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Direction, emptyGame, GameState, move as applyMove, newGame } from "../logic/engine";
import { chooseMove, SolverId } from "../logic/solvers";

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

export type Speed = { label: string; delayMs: number; slideMs: number };

// `slideMs` is the tile-slide duration at this speed — kept just under the
// delay so a move finishes animating before the next one starts.
export const SPEEDS: Speed[] = [
  { label: "0.5×", delayMs: 360, slideMs: 200 },
  { label: "1×", delayMs: 180, slideMs: 150 },
  { label: "2×", delayMs: 90, slideMs: 85 },
  { label: "4×", delayMs: 45, slideMs: 50 },
  { label: "Max", delayMs: 0, slideMs: 40 },
];

/** Slide duration for manual (keyboard / D-pad) play. */
export const MANUAL_SLIDE_MS = 150;

export function useGame2048() {
  // Start empty (deterministic) so server and client render the same markup;
  // the real randomised board is dealt on the client after mount.
  const [state, setState] = useState<GameState>(emptyGame);
  const [running, setRunning] = useState(false);
  const [solver, setSolver] = useState<SolverId>("montecarlo");
  const [speedIndex, setSpeedIndex] = useState(1);
  const [simulations, setSimulations] = useState(20);

  // Refs let the async solver loop read the latest values without re-subscribing.
  const stateRef = useRef(state);
  const runningRef = useRef(running);
  const solverRef = useRef(solver);
  const speedRef = useRef(speedIndex);
  const simsRef = useRef(simulations);
  useEffect(() => {
    stateRef.current = state;
    runningRef.current = running;
    solverRef.current = solver;
    speedRef.current = speedIndex;
    simsRef.current = simulations;
  });

  // Deal the first real board once mounted (client only), replacing the empty
  // placeholder used for SSR.
  useEffect(() => {
    // Intentional one-time client-only init; randomising during render/SSR would
    // cause a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => (prev.tiles.length === 0 ? newGame(prev.best) : prev));
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setState((prev) => newGame(prev.best));
  }, []);

  const doMove = useCallback((dir: Direction) => {
    setState((prev) => applyMove(prev, dir).state);
  }, []);

  const keepPlaying = useCallback(() => {
    setState((prev) => ({ ...prev, keepPlaying: true }));
  }, []);

  // Manual keyboard play — disabled while the AI is driving.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (runningRef.current) return;
      const dir = KEY_MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      doMove(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  // Auto-solve loop: compute a move, apply it, then schedule the next tick.
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const current = stateRef.current;
      if (current.over || (current.won && !current.keepPlaying)) {
        setRunning(false);
        return;
      }
      const dir = chooseMove(current, solverRef.current, simsRef.current);
      if (!dir) {
        setRunning(false);
        return;
      }
      setState((prev) => applyMove(prev, dir).state);
      timer = setTimeout(tick, SPEEDS[speedRef.current].delayMs);
    };

    timer = setTimeout(tick, SPEEDS[speedRef.current].delayMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [running]);

  const toggleRunning = useCallback(() => {
    setState((prev) => {
      // Restart a finished board before auto-solving again.
      if (prev.over || (prev.won && !prev.keepPlaying)) return newGame(prev.best);
      return prev;
    });
    setRunning((r) => !r);
  }, []);

  return {
    state,
    running,
    solver,
    setSolver,
    speedIndex,
    setSpeedIndex,
    simulations,
    setSimulations,
    reset,
    doMove,
    keepPlaying,
    toggleRunning,
  };
}
