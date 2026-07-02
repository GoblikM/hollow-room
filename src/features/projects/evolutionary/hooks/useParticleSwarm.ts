"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { PSO, type PSOConfig } from "../logic/pso";
import { computeGrid, drawLandscape, drawParticles, drawConvergence, type Grid, type Palette } from "../logic/landscape";

// Přečte aktuální barvy tématu z CSS proměnných (mění se přepínačem témat).
function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return {
    min: v("--color-accent-bright"), // minimum krajiny svítí akcentem
    max: v("--color-base"), // maximum splývá s pozadím
    particle: v("--color-fg"),
    gBest: v("--color-accent-bright"),
    gBestOutline: v("--color-fg"),
    line: v("--color-accent-bright"),
  };
}

// --- Pomocné funkce pro plynulou interpolaci ---

// hluboká kopie pozic (ať si snímek nedrží referenci na živá data)
function clonePositions(positions: number[][]): number[][] {
  return positions.map((row) => [...row]);
}

// lineární přechod mezi dvěma sadami pozic: t=0 → a, t=1 → b
function lerpPositions(a: number[][], b: number[][], t: number): number[][] {
  return a.map((row, i) => row.map((value, j) => value + (b[i][j] - value) * t));
}

// totéž pro jeden bod (gBest)
function lerpPoint(a: number[], b: number[], t: number): number[] {
  return a.map((value, j) => value + (b[j] - value) * t);
}

// Řídí jeden běh PSO na canvasu: animační smyčku a ovládání (play/pause/reset).
export function useParticleSwarm(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  chartCanvasRef: RefObject<HTMLCanvasElement | null>,
  config: PSOConfig,
  size: number,
  resolution: number,
  speed: number, // kolik kroků PSO udělat za jeden snímek (klidně zlomek)
) {
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);

  // Proměnlivé věci, které NEMAJÍ spouštět re-render — proto refy, ne useState:
  const psoRef = useRef<PSO | null>(null); // aktuální roj
  const gridRef = useRef<Grid | null>(null); // navzorkovaná krajina (počítá se jednou)
  const runningRef = useRef(false); // čte ho animační smyčka každý snímek
  const speedRef = useRef(speed); // smyčka čte rychlost přes ref (aby šla měnit za běhu)
  speedRef.current = speed;
  const accumulatorRef = useRef(0); // 0..1 = jak daleko jsme k dalšímu kroku PSO

  // Snímky pozic pro interpolaci: kreslíme přechod z "prev" do "curr".
  const prevPositionsRef = useRef<number[][]>([]);
  const currPositionsRef = useRef<number[][]>([]);
  const prevGBestRef = useRef<number[]>([]);
  const currGBestRef = useRef<number[]>([]);

  // Vykreslí krajinu + částice na zadaných pozicích.
  function drawAt(positions: number[][], gBest: number[]) {
    const ctx = canvasRef.current?.getContext("2d");
    const grid = gridRef.current;
    if (!ctx || !grid) return;
    const palette = readPalette();
    drawLandscape(ctx, grid, size, palette);
    drawParticles(ctx, positions, gBest, config.bounds, size, palette);
  }

  // Vykreslí konvergenční graf z historie gBestScore.
  function drawChart() {
    const canvas = chartCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    const pso = psoRef.current;
    if (!canvas || !ctx || !pso) return;
    drawConvergence(ctx, pso.history, canvas.width, canvas.height, readPalette());
  }

  // Postaví nový roj + mřížku a vykreslí výchozí stav.
  function reset() {
    runningRef.current = false;
    setIsRunning(false);
    accumulatorRef.current = 0;

    const pso = new PSO(config);
    pso.evaluate(); // ať gBest hned sedí na počáteční pozice
    psoRef.current = pso;
    gridRef.current = computeGrid(config.fn, config.bounds, resolution);

    // na začátku prev == curr (nikam se neinterpoluje)
    prevPositionsRef.current = clonePositions(pso.positions);
    currPositionsRef.current = clonePositions(pso.positions);
    prevGBestRef.current = [...pso.gBestPosition];
    currGBestRef.current = [...pso.gBestPosition];

    setIteration(0);
    drawAt(currPositionsRef.current, currGBestRef.current);
    drawChart();
  }

  function play() {
    runningRef.current = true;
    setIsRunning(true);
  }

  function pause() {
    runningRef.current = false;
    setIsRunning(false);
  }

  // Setup + animační smyčka. Smyčka běží pořád, krokuje jen když runningRef.
  useEffect(() => {
    reset(); // výchozí roj hned po namontování

    let frameId = 0;
    function loop() {
      const pso = psoRef.current;
      if (runningRef.current && pso) {
        // nasčítej rychlost; každý celý nasčítaný díl = jeden krok PSO
        accumulatorRef.current += speedRef.current;
        while (accumulatorRef.current >= 1) {
          accumulatorRef.current -= 1;
          if (pso.iteration >= config.maxIterations) {
            runningRef.current = false;
            setIsRunning(false);
            accumulatorRef.current = 0;
            break;
          }
          // ulož starý stav, udělej krok, ulož nový stav → mezi nimi pak interpolujeme
          prevPositionsRef.current = currPositionsRef.current;
          prevGBestRef.current = currGBestRef.current;
          pso.step();
          currPositionsRef.current = clonePositions(pso.positions);
          currGBestRef.current = [...pso.gBestPosition];
        }

        // vykresli částice někde MEZI starým a novým stavem (plynulý pohyb)
        const alpha = accumulatorRef.current; // 0..1
        const positions = lerpPositions(prevPositionsRef.current, currPositionsRef.current, alpha);
        const gBest = lerpPoint(prevGBestRef.current, currGBestRef.current, alpha);

        setIteration(pso.iteration);
        drawAt(positions, gBest);
        drawChart();
      }
      frameId = requestAnimationFrame(loop); // naplánuj další snímek
    }
    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId); // úklid při odchodu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return { isRunning, iteration, play, pause, reset };
}
