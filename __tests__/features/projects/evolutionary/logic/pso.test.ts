import { PSO, type PSOConfig } from "@/features/projects/evolutionary/logic/pso";
import { TEST_FUNCTIONS } from "@/features/projects/evolutionary/logic/testFunctions";

// Pomocná: postaví config pro danou funkci s rozumnými výchozími parametry.
function makeConfig(fnKey: keyof typeof TEST_FUNCTIONS, overrides: Partial<PSOConfig> = {}): PSOConfig {
  const entry = TEST_FUNCTIONS[fnKey];
  return {
    fn: entry.fn,
    bounds: entry.bounds,
    dimensions: 2,
    popSize: 30,
    inertia: 0.7,
    cognitiveWeight: 1.49618,
    socialWeight: 1.49618,
    maxIterations: 200,
    topology: "global",
    inertiaLinear: false,
    inertiaStart: 0.8,
    inertiaEnd: 0.3,
    ...overrides,
  };
}

// Necháme roj běžet a vrátíme hotový PSO.
function run(config: PSOConfig): PSO {
  const pso = new PSO(config);
  for (let i = 0; i < config.maxIterations; i++) pso.step();
  return pso;
}

describe("PSO", () => {
  test("konverguje na sphere (global topologie)", () => {
    const pso = run(makeConfig("sphere"));
    // minimum sphere je 0; po 200 iteracích má být gBest hodně blízko
    expect(pso.gBestScore).toBeLessThan(0.01);
  });

  test("konverguje na sphere (ring topologie)", () => {
    const pso = run(makeConfig("sphere", { topology: "ring" }));
    expect(pso.gBestScore).toBeLessThan(0.1);
  });

  test("konverguje na ackley (lineární setrvačnost)", () => {
    const pso = run(makeConfig("ackley", { inertiaLinear: true, cognitiveWeight: 2, socialWeight: 2 }));
    expect(pso.gBestScore).toBeLessThan(1);
  });

  test("history zaznamenává gBest každou iteraci a nikdy se nezhorší", () => {
    const pso = run(makeConfig("sphere"));
    expect(pso.history).toHaveLength(200);
    // gBest se smí jen zlepšovat (klesat) → historie je neklesající-obráceně (nerostoucí)
    for (let i = 1; i < pso.history.length; i++) {
      expect(pso.history[i]).toBeLessThanOrEqual(pso.history[i - 1]);
    }
  });

  test("částice zůstávají v mezích", () => {
    const pso = run(makeConfig("sphere"));
    const [min, max] = pso.config.bounds;
    for (const particle of pso.positions) {
      for (const coord of particle) {
        expect(coord).toBeGreaterThanOrEqual(min);
        expect(coord).toBeLessThanOrEqual(max);
      }
    }
  });
});
