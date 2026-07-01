import type { TestFunction } from "./testFunctions";

// Nastavení jednoho běhu PSO. Tohle do třídy pošle UI (přes hook).
export type PSOConfig = {
  fn: TestFunction; // optimalizovaná funkce
  bounds: [number, number]; // [min, max] rozsahu pro každou dimenzi
  dim: number; // počet dimenzí (pro vizualizaci 2)
  popSize: number; // počet částic
  w: number; // setrvačnost (konstantní varianta)
  c1: number; // váha osobního nejlepšího (pBest)
  c2: number; // váha globálního nejlepšího (gBest)
  maxIter: number; // počet iterací (pro lineární setrvačnost)
  topology: "global" | "ring"; // topologie sousedství
  wLinear: boolean; // měnit w lineárně v čase?
  wStart: number; // počáteční w (jen když wLinear)
  wEnd: number; // konečné w (jen když wLinear)
};

// --- Pomocné funkce ---

// náhodné číslo v rozsahu [min, max) — náhrada za np.random.uniform
function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// matice size×dim náhodných jedinců — náhrada za generate_population
function generatePopulation(size: number, dim: number, bounds: [number, number]): number[][] {
  const [min, max] = bounds;
  const pop: number[][] = [];
  for (let i = 0; i < size; i++) {
    const individual: number[] = [];
    for (let j = 0; j < dim; j++) {
      individual.push(randomInRange(min, max));
    }
    pop.push(individual);
  }
  return pop;
}

// matice rows×cols vyplněná nulami — náhrada za np.zeros
function zeros(rows: number, cols: number): number[][] {
  const m: number[][] = [];
  for (let i = 0; i < rows; i++) {
    m.push(new Array(cols).fill(0));
  }
  return m;
}

// omezí hodnotu do rozsahu [lo, hi] — náhrada za np.clip (pro jedno číslo)
function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

export class PSO {
  config: PSOConfig;
  w: number; // aktuální setrvačnost (u lineární varianty se mění každou iteraci)

  positions: number[][]; // aktuální pozice částic (x)
  velocities: number[][]; // aktuální rychlosti (v)
  pBestPositions: number[][]; // osobní nejlepší pozice každé částice
  pBestScores: number[]; // fitness osobních nejlepších
  gBestPosition: number[]; // globální nejlepší pozice
  gBestScore: number; // fitness globálního nejlepšího
  history: number[]; // vývoj gBestScore (na konvergenční graf)
  iteration: number; // číslo aktuální iterace

  constructor(config: PSOConfig) {
    this.config = config;
    this.w = config.wLinear ? config.wStart : config.w;

    this.positions = generatePopulation(config.popSize, config.dim, config.bounds);
    this.velocities = zeros(config.popSize, config.dim); // v(0) = 0
    this.pBestPositions = this.positions.map((p) => [...p]); // kopie pozic (ne reference!)
    this.pBestScores = new Array(config.popSize).fill(Infinity);
    this.gBestPosition = new Array(config.dim).fill(0);
    this.gBestScore = Infinity;
    this.history = [];
    this.iteration = 0;
  }

  // Krok 2: vyhodnotí fitness všech částic a aktualizuje pBest + gBest.
  evaluate(): void {
    // TODO
  }

  // Krok 3: aktualizuje rychlosti (podle pBest a gBest/souseda).
  updateVelocity(): void {
    // TODO
  }

  // Krok 4: posune částice a ořízne je do rozsahu.
  updatePosition(): void {
    // TODO
  }

  // Krok 5: jedna iterace algoritmu (nahrazuje smyčku z optimize() v notebooku).
  step(): void {
    // TODO
  }
}
