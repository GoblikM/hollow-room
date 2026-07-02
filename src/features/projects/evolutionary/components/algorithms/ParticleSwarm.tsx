"use client";

import { useMemo, useRef, useState } from "react";
import { TEST_FUNCTIONS } from "../../logic/testFunctions";
import type { PSOConfig } from "../../logic/pso";
import { useParticleSwarm } from "../../hooks/useParticleSwarm";
import Slider from "@/shared/ui/Slider";
import styles from "./ParticleSwarm.module.css";

const SIZE = 480;
const CHART_HEIGHT = 120;
const RESOLUTION = 120;
const MAX_ITERATIONS = 200;

// Small reusable labelled slider (keeps the JSX from repeating).
function RangeField(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted">
        {props.label}: {props.display ?? props.value}
      </span>
      <Slider
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </label>
  );
}

export default function ParticleSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  // PSO parameters (changing any of them restarts the run)
  const [fnKey, setFnKey] = useState<keyof typeof TEST_FUNCTIONS>("ackley");
  const [topology, setTopology] = useState<"global" | "ring">("global");
  const [popSize, setPopSize] = useState(30);
  const [inertia, setInertia] = useState(0.7);
  const [cognitiveWeight, setCognitiveWeight] = useState(1.5);
  const [socialWeight, setSocialWeight] = useState(1.5);

  // Animation speed (kept out of config — it must not reset the swarm)
  const [speedLevel, setSpeedLevel] = useState(5);
  const stepsPerFrame = speedLevel * 0.02;

  const config = useMemo<PSOConfig>(
    () => ({
      fn: TEST_FUNCTIONS[fnKey].fn,
      bounds: TEST_FUNCTIONS[fnKey].bounds,
      dimensions: 2,
      popSize,
      inertia,
      cognitiveWeight,
      socialWeight,
      maxIterations: MAX_ITERATIONS,
      topology,
      inertiaLinear: false,
      inertiaStart: 0.8,
      inertiaEnd: 0.3,
    }),
    [fnKey, topology, popSize, inertia, cognitiveWeight, socialWeight],
  );

  const { isRunning, iteration, play, pause, reset } = useParticleSwarm(
    canvasRef,
    chartCanvasRef,
    config,
    SIZE,
    RESOLUTION,
    stepsPerFrame,
  );

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {/* LEFT — landscape + convergence chart */}
      <div className="flex flex-col gap-3">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className={styles.canvas} />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Convergence (best fitness)</span>
          <canvas ref={chartCanvasRef} width={SIZE} height={CHART_HEIGHT} className={styles.canvas} />
        </div>
      </div>

      {/* RIGHT — settings panel */}
      <div className={`flex w-full flex-col gap-4 p-4 font-mono text-sm md:w-64 ${styles.panel}`}>
        {/* Function */}
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted">Function</span>
          <select
            value={fnKey}
            onChange={(e) => setFnKey(e.target.value as keyof typeof TEST_FUNCTIONS)}
            className={`px-2 py-1 ${styles.control}`}
          >
            {Object.entries(TEST_FUNCTIONS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {/* Topology */}
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted">Topology</span>
          <select
            value={topology}
            onChange={(e) => setTopology(e.target.value as "global" | "ring")}
            className={`px-2 py-1 ${styles.control}`}
          >
            <option value="global">Global (star)</option>
            <option value="ring">Ring</option>
          </select>
        </label>

        <RangeField label="Population" value={popSize} min={10} max={100} step={5} onChange={setPopSize} />
        <RangeField
          label="Inertia w"
          value={inertia}
          min={0}
          max={1}
          step={0.05}
          onChange={setInertia}
          display={inertia.toFixed(2)}
        />
        <RangeField
          label="Cognitive c1"
          value={cognitiveWeight}
          min={0}
          max={3}
          step={0.1}
          onChange={setCognitiveWeight}
          display={cognitiveWeight.toFixed(1)}
        />
        <RangeField
          label="Social c2"
          value={socialWeight}
          min={0}
          max={3}
          step={0.1}
          onChange={setSocialWeight}
          display={socialWeight.toFixed(1)}
        />
        <RangeField label="Speed" value={speedLevel} min={1} max={10} step={1} onChange={setSpeedLevel} />

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={isRunning ? pause : play} className={`flex-1 px-3 py-2 font-pixel text-xs uppercase tracking-wide ${styles.button}`}>
            {isRunning ? "Pause" : "Play"}
          </button>
          <button onClick={reset} className={`flex-1 px-3 py-2 font-pixel text-xs uppercase tracking-wide ${styles.button}`}>
            Reset
          </button>
        </div>

        <span className="text-muted">
          Iteration: {iteration} / {MAX_ITERATIONS}
        </span>
        <span className="text-xs leading-relaxed text-muted opacity-70">Changing any parameter restarts the run.</span>
      </div>
    </div>
  );
}
