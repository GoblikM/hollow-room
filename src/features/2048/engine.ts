// 2048 game engine — ported from template_projects/2048_base.ipynb.
// Uses stable tile identities so the UI can animate tiles sliding/merging.

export const SIZE = 4;

export type Direction = "up" | "down" | "left" | "right";

export type Tile = {
  id: number;
  value: number;
  row: number;
  col: number;
  /** Freshly spawned this turn — triggers the spawn animation. */
  isNew: boolean;
  /** Result of a merge this turn — triggers the pop animation. */
  merged: boolean;
};

export type GameState = {
  tiles: Tile[];
  score: number;
  best: number;
  moves: number;
  won: boolean;
  over: boolean;
  /** Player chose to continue after reaching 2048. */
  keepPlaying: boolean;
};

type Cell = Tile | null;
type Grid = Cell[][];

let idCounter = 1;
const nextId = () => idCounter++;

const vectors: Record<Direction, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const inBounds = (r: number, c: number) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(null));
}

function gridToTiles(grid: Grid): Tile[] {
  const tiles: Tile[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const t = grid[r][c];
      if (t) tiles.push(t);
    }
  }
  return tiles;
}

function emptyCells(grid: Grid): Array<{ row: number; col: number }> {
  const cells: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) cells.push({ row: r, col: c });
    }
  }
  return cells;
}

/** Mirrors `add_new_number`: 90% chance of a 2, 10% chance of a 4. */
function spawnTile(grid: Grid): boolean {
  const cells = emptyCells(grid);
  if (cells.length === 0) return false;
  const { row, col } = cells[Math.floor(Math.random() * cells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  grid[row][col] = { id: nextId(), value, row, col, isNew: true, merged: false };
  return true;
}

/** Mirrors `check_game_over`: no empty cells and no adjacent equal tiles. */
function isGameOver(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return false;
      const v = grid[r][c]!.value;
      if (r < SIZE - 1 && grid[r + 1][c]?.value === v) return false;
      if (c < SIZE - 1 && grid[r][c + 1]?.value === v) return false;
    }
  }
  return true;
}

/** Traversal order: process cells starting from the side we're moving toward. */
function buildTraversals(vec: { row: number; col: number }) {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];
  if (vec.row === 1) rows.reverse();
  if (vec.col === 1) cols.reverse();
  return { rows, cols };
}

function findFarthest(grid: Grid, row: number, col: number, vec: { row: number; col: number }) {
  let prevR = row;
  let prevC = col;
  let r = row + vec.row;
  let c = col + vec.col;
  while (inBounds(r, c) && !grid[r][c]) {
    prevR = r;
    prevC = c;
    r += vec.row;
    c += vec.col;
  }
  return { farthest: { row: prevR, col: prevC }, next: { row: r, col: c } };
}

/**
 * A deterministic, tile-free board. Used for the first (server) render so SSR
 * and client hydration match — the real random board is generated on the client
 * after mount. Avoids a hydration mismatch from Math.random() during prerender.
 */
export function emptyGame(): GameState {
  return { tiles: [], score: 0, best: 0, moves: 0, won: false, over: false, keepPlaying: false };
}

export function newGame(best = 0): GameState {
  const grid = emptyGrid();
  spawnTile(grid);
  spawnTile(grid);
  return {
    tiles: gridToTiles(grid),
    score: 0,
    best,
    moves: 0,
    won: false,
    over: false,
    keepPlaying: false,
  };
}

/**
 * Apply a move. Returns the next state plus whether anything actually moved.
 * Spawns a new tile only when the board changed (matches `play_2048`).
 */
export function move(state: GameState, dir: Direction): { state: GameState; moved: boolean } {
  if (state.over || (state.won && !state.keepPlaying)) {
    return { state, moved: false };
  }

  const vec = vectors[dir];

  // Work on fresh tile copies so the previous state is never mutated. Mutating
  // tiles held in React state breaks under StrictMode's double-invoked updaters
  // (the second pass sees already-moved tiles and skips the spawn).
  const grid = emptyGrid();
  for (const t of state.tiles) {
    grid[t.row][t.col] = { ...t, isNew: false, merged: false };
  }

  const { rows, cols } = buildTraversals(vec);
  let moved = false;
  let score = state.score;
  let won = state.won;

  for (const r of rows) {
    for (const c of cols) {
      const tile = grid[r][c];
      if (!tile) continue;

      const { farthest, next } = findFarthest(grid, r, c, vec);
      const target = inBounds(next.row, next.col) ? grid[next.row][next.col] : null;

      if (target && target.value === tile.value && !target.merged) {
        // Merge: slide `tile` onto the target cell, doubling its value.
        grid[r][c] = null;
        tile.row = next.row;
        tile.col = next.col;
        tile.value *= 2;
        tile.merged = true;
        grid[next.row][next.col] = tile; // discards the consumed target tile
        score += tile.value;
        if (tile.value === 2048) won = true;
        moved = true;
      } else if (farthest.row !== r || farthest.col !== c) {
        grid[r][c] = null;
        tile.row = farthest.row;
        tile.col = farthest.col;
        grid[farthest.row][farthest.col] = tile;
        moved = true;
      }
    }
  }

  if (moved) spawnTile(grid);

  const over = isGameOver(grid);
  const next: GameState = {
    tiles: gridToTiles(grid),
    score,
    best: Math.max(state.best, score),
    moves: moved ? state.moves + 1 : state.moves,
    won,
    over,
    keepPlaying: state.keepPlaying,
  };
  return { state: next, moved };
}

export function maxTile(state: GameState): number {
  return state.tiles.reduce((m, t) => Math.max(m, t.value), 0);
}
