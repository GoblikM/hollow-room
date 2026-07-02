import type { TestFunction } from "./testFunctions";

export type Grid = {
  values: number[][];
  min: number;
  max: number;
};

export function worldToPixel(coord: number, bounds: [number, number], size: number) {
  const [min, max] = bounds;
  return ((coord - min) / (max - min)) * size;
}

export function computeGrid(fn: TestFunction, bounds: [number, number], resolution: number): Grid {
  const [min, max] = bounds;
  const values: number[][] = [];
  let vMin = Infinity;
  let vMax = -Infinity;

  for (let row = 0; row < resolution; row++) {
    const rowValues: number[] = [];
    for (let col = 0; col < resolution; col++) {
      const x = min + (col / (resolution - 1)) * (max - min);
      const y = min + (row / (resolution - 1)) * (max - min);

      const value = fn([x, y]);
      rowValues.push(value);

      if (value < vMin) vMin = value;
      if (value > vMax) vMax = value;
    }
    values.push(rowValues);
  }
  return { values, min: vMin, max: vMax };
}

// Barvy pro kreslení — přebírají se z CSS proměnných tématu (viz useParticleSwarm).
export type Palette = {
  min: string; // barva krajiny v minimu (svítivý akcent)
  max: string; // barva krajiny v maximu (tmavé pozadí)
  particle: string; // částice
  gBest: string; // nejlepší jedinec
  gBestOutline: string; // obrys gBestu (ať je vidět na jakémkoliv pozadí)
  line: string; // konvergenční křivka
};

type RGB = { r: number; g: number; b: number };

// Převede libovolný CSS barevný zápis (hex/hsl/rgb) na složky RGB — přes canvas,
// který barvu sám znormalizuje (nastavím fillStyle a přečtu ho zpět jako hex).
function toRGB(ctx: CanvasRenderingContext2D, color: string): RGB {
  ctx.fillStyle = color;
  const normalized = ctx.fillStyle; // canvas vrátí "#rrggbb"
  if (normalized.startsWith("#")) {
    return {
      r: parseInt(normalized.slice(1, 3), 16),
      g: parseInt(normalized.slice(3, 5), 16),
      b: parseInt(normalized.slice(5, 7), 16),
    };
  }
  const parts = normalized.match(/\d+/g); // fallback pro "rgb(...)"
  return parts ? { r: +parts[0], g: +parts[1], b: +parts[2] } : { r: 255, g: 255, b: 255 };
}

export function drawLandscape(ctx: CanvasRenderingContext2D, grid: Grid, size: number, palette: Palette): void {
  const resolution = grid.values.length;
  const cellSize = size / resolution;

  // koncové barvy převedu na RGB jednou, v cyklu už jen míchám
  const minColor = toRGB(ctx, palette.min);
  const maxColor = toRGB(ctx, palette.max);

  for (let row = 0; row < resolution; row++) {
    for (let col = 0; col < resolution; col++) {
      const value = grid.values[row][col];
      const t = (value - grid.min) / (grid.max - grid.min); // 0 = minimum, 1 = maximum

      // t=0 → minColor (svítí), t=1 → maxColor (tmavé)
      const r = Math.round(minColor.r + (maxColor.r - minColor.r) * t);
      const g = Math.round(minColor.g + (maxColor.g - minColor.g) * t);
      const b = Math.round(minColor.b + (maxColor.b - minColor.b) * t);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize + 1, cellSize + 1);
    }
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  positions: number[][],
  gBest: number[],
  bounds: [number, number],
  size: number,
  palette: Palette,
): void {
  // 1) částice — malá kolečka
  ctx.fillStyle = palette.particle;
  for (const particle of positions) {
    const px = worldToPixel(particle[0], bounds, size); // x → pixel
    const py = worldToPixel(particle[1], bounds, size); // y → pixel
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2); // poloměr 3
    ctx.fill();
  }

  // 2) gBest — větší kolečko s obrysem (ať je vidět na jakémkoliv pozadí)
  const gx = worldToPixel(gBest[0], bounds, size);
  const gy = worldToPixel(gBest[1], bounds, size);
  ctx.beginPath();
  ctx.arc(gx, gy, 6, 0, Math.PI * 2); // poloměr 6
  ctx.fillStyle = palette.gBest;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = palette.gBestOutline;
  ctx.stroke();
}

// Vykreslí konvergenční křivku (vývoj nejlepší fitness) na malý graf.
export function drawConvergence(
  ctx: CanvasRenderingContext2D,
  history: number[],
  width: number,
  height: number,
  palette: Palette,
): void {
  ctx.clearRect(0, 0, width, height);
  if (history.length < 2) return;

  const maxV = Math.max(...history);
  const minV = Math.min(...history);
  const range = maxV - minV || 1; // ochrana proti dělení nulou (plochá historie)

  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < history.length; i++) {
    const x = (i / (history.length - 1)) * width; // iterace → vodorovná osa
    const y = height - ((history[i] - minV) / range) * height; // fitness → svislá (klesá dolů)
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
