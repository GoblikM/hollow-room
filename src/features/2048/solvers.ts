// AI solvers — ported from the three approaches in 2048_base.ipynb:
// random, a fixed-priority "greedy corner" heuristic, and Monte Carlo rollouts.
//
// Solvers operate on a plain number[][] grid (no tile identities) for speed.

import { Direction, GameState, SIZE } from "./engine";

type NumGrid = number[][];

const ALL_MOVES: Direction[] = ["left", "right", "up", "down"];

export type SolverId = "random" | "greedy" | "montecarlo";

export const SOLVERS: { id: SolverId; label: string; blurb: string }[] = [
  { id: "random", label: "Random", blurb: "Picks any legal move at random." },
  { id: "greedy", label: "Greedy corner", blurb: "Fixed priority — packs tiles into a corner." },
  { id: "montecarlo", label: "Monte Carlo", blurb: "Plays out random games per move. Strong, slower." },
];

export function gridFromState(state: GameState): NumGrid {
  const g: NumGrid = Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0));
  for (const t of state.tiles) g[t.row][t.col] = t.value;
  return g;
}

function cloneGrid(g: NumGrid): NumGrid {
  return g.map((row) => row.slice());
}

function slide(line: number[]): { line: number[]; gained: number } {
  const nums = line.filter((x) => x !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const v = nums[i] * 2;
      out.push(v);
      gained += v;
      i++;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { line: out, gained };
}

/** Pure move on a numeric grid. No spawning — used inside simulations. */
function applyMove(grid: NumGrid, dir: Direction): { grid: NumGrid; gained: number; moved: boolean } {
  const next = cloneGrid(grid);
  let gained = 0;

  const getLine = (i: number): number[] => {
    if (dir === "left" || dir === "right") {
      const row = next[i].slice();
      return dir === "right" ? row.reverse() : row;
    }
    const col = [next[0][i], next[1][i], next[2][i], next[3][i]];
    return dir === "down" ? col.reverse() : col;
  };

  const setLine = (i: number, line: number[]) => {
    const final = dir === "right" || dir === "down" ? line.slice().reverse() : line;
    if (dir === "left" || dir === "right") {
      next[i] = final;
    } else {
      for (let r = 0; r < SIZE; r++) next[r][i] = final[r];
    }
  };

  for (let i = 0; i < SIZE; i++) {
    const res = slide(getLine(i));
    setLine(i, res.line);
    gained += res.gained;
  }

  const moved = next.some((row, r) => row.some((v, c) => v !== grid[r][c]));
  return { grid: next, gained, moved };
}

function spawn(grid: NumGrid): boolean {
  const empty: Array<[number, number]> = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return false;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function legalMoves(grid: NumGrid): Direction[] {
  return ALL_MOVES.filter((d) => applyMove(grid, d).moved);
}

// ── Random solver ───────────────────────────────────────────────────────────
function randomMove(grid: NumGrid): Direction | null {
  const legal = legalMoves(grid);
  if (legal.length === 0) return null;
  return legal[Math.floor(Math.random() * legal.length)];
}

// ── Greedy corner solver ─────────────────────────────────────────────────────
// Fixed priority keeps the largest tiles pinned to one corner, mirroring the
// notebook's up→left bias with down/right as fallbacks.
const GREEDY_PRIORITY: Direction[] = ["left", "up", "down", "right"];
function greedyMove(grid: NumGrid): Direction | null {
  for (const d of GREEDY_PRIORITY) {
    if (applyMove(grid, d).moved) return d;
  }
  return null;
}

// ── Monte Carlo solver ───────────────────────────────────────────────────────
function randomPlayout(grid: NumGrid, startScore: number): number {
  let g = cloneGrid(grid);
  let score = startScore;
  for (let i = 0; i < 800; i++) {
    const legal = legalMoves(g);
    if (legal.length === 0) break;
    const dir = legal[Math.floor(Math.random() * legal.length)];
    const res = applyMove(g, dir);
    g = res.grid;
    score += res.gained;
    spawn(g);
  }
  return score;
}

function monteCarloMove(grid: NumGrid, score: number, simulations: number): Direction | null {
  let bestMove: Direction | null = null;
  let bestAvg = -1;
  for (const d of ALL_MOVES) {
    const first = applyMove(grid, d);
    if (!first.moved) continue;
    const seed = cloneGrid(first.grid);
    spawn(seed);
    let total = 0;
    for (let i = 0; i < simulations; i++) {
      total += randomPlayout(seed, score + first.gained);
    }
    const avg = total / simulations;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestMove = d;
    }
  }
  // Fall back to any legal move so the AI never stalls with moves left.
  return bestMove ?? randomMove(grid);
}

export function chooseMove(
  state: GameState,
  solver: SolverId,
  simulations: number,
): Direction | null {
  const grid = gridFromState(state);
  switch (solver) {
    case "random":
      return randomMove(grid);
    case "greedy":
      return greedyMove(grid);
    case "montecarlo":
      return monteCarloMove(grid, state.score, simulations);
  }
}
