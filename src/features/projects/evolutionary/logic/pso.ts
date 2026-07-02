import type { TestFunction } from "./testFunctions";

// Nastavení jednoho běhu PSO. Tohle do třídy pošle UI (přes hook).
export type PSOConfig = {
  fn: TestFunction; // optimalizovaná funkce
  bounds: [number, number]; // [min, max] rozsahu pro každou dimenzi
  dimensions: number; // počet dimenzí (pro vizualizaci 2)
  popSize: number; // počet částic
  inertia: number; // setrvačnost (v literatuře "w") — jak moc si částice drží dosavadní směr
  cognitiveWeight: number; // "c1" — přitažlivost k vlastnímu nejlepšímu (pBest)
  socialWeight: number; // "c2" — přitažlivost k nejlepšímu v okolí (gBest/soused)
  maxIterations: number; // počet iterací (pro lineární setrvačnost)
  topology: "global" | "ring"; // topologie sousedství
  inertiaLinear: boolean; // měnit setrvačnost lineárně v čase?
  inertiaStart: number; // počáteční setrvačnost (jen když inertiaLinear)
  inertiaEnd: number; // konečná setrvačnost (jen když inertiaLinear)
};

// --- Pomocné funkce ---

// náhodné číslo v rozsahu [min, max) — náhrada za np.random.uniform
function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// matice size×dimensions náhodných jedinců — náhrada za generate_population
function generatePopulation(size: number, dimensions: number, bounds: [number, number]): number[][] {
  const [min, max] = bounds;
  const population: number[][] = [];
  for (let i = 0; i < size; i++) {
    const individual: number[] = [];
    for (let j = 0; j < dimensions; j++) {
      individual.push(randomInRange(min, max));
    }
    population.push(individual);
  }
  return population;
}

// matice rows×cols vyplněná nulami — náhrada za np.zeros
function zeros(rows: number, cols: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(new Array(cols).fill(0));
  }
  return matrix;
}

// omezí hodnotu do rozsahu [min, max] — náhrada za np.clip (pro jedno číslo)
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class PSO {
  config: PSOConfig;
  inertia: number; // aktuální setrvačnost (u lineární varianty se mění každou iteraci)

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
    this.inertia = config.inertiaLinear ? config.inertiaStart : config.inertia;

    this.positions = generatePopulation(config.popSize, config.dimensions, config.bounds);
    this.velocities = zeros(config.popSize, config.dimensions); // v(0) = 0
    this.pBestPositions = this.positions.map((position) => [...position]); // kopie pozic (ne reference!)
    this.pBestScores = new Array(config.popSize).fill(Infinity);
    this.gBestPosition = new Array(config.dimensions).fill(0);
    this.gBestScore = Infinity;
    this.history = [];
    this.iteration = 0;
  }

  // Vrátí pozici, ke které částice i "vzhlíží":
  //  - global: nejlepší z celého roje (gBest)
  //  - ring:   nejlepší z jejích sousedů (i-2 .. i+2)
  getInformant(i: number): number[] {
    if (this.config.topology === "global") {
      return this.gBestPosition;
    }

    // ring: projdi sousedy i-2..i+2 a najdi toho s nejlepším (nejmenším) pBestScore
    const popSize = this.config.popSize;
    let bestIndex = i;
    let bestScore = Infinity;
    for (let offset = -2; offset <= 2; offset++) {
      const neighbour = (((i + offset) % popSize) + popSize) % popSize; // ← přetočení záporných indexů
      if (this.pBestScores[neighbour] < bestScore) {
        bestScore = this.pBestScores[neighbour];
        bestIndex = neighbour;
      }
    }
    return this.pBestPositions[bestIndex];
  }

  // Krok 2: vyhodnotí fitness všech částic a aktualizuje pBest + gBest.
  evaluate(): void {
    for (let i = 0; i < this.config.popSize; i++) {
      const score = this.config.fn(this.positions[i]);

      if (score < this.pBestScores[i]) {
        this.pBestScores[i] = score;
        this.pBestPositions[i] = [...this.positions[i]];
      }
      if (score < this.gBestScore) {
        this.gBestScore = score;
        this.gBestPosition = [...this.positions[i]];
      }
    }
  }

  // Krok 3: aktualizuje rychlosti (podle pBest a gBest/souseda).
  updateVelocity(): void {
    const maxVelocity = 0.2 * (this.config.bounds[1] - this.config.bounds[0]);

    for (let i = 0; i < this.config.popSize; i++) {
      const informant = this.getInformant(i);
      for (let j = 0; j < this.config.dimensions; j++) {
        const randomCognitive = Math.random();
        const randomSocial = Math.random();

        const cognitive =
          this.config.cognitiveWeight * randomCognitive * (this.pBestPositions[i][j] - this.positions[i][j]);
        const social = this.config.socialWeight * randomSocial * (informant[j] - this.positions[i][j]);

        let velocity = this.inertia * this.velocities[i][j] + cognitive + social;
        velocity = clamp(velocity, -maxVelocity, maxVelocity);
        this.velocities[i][j] = velocity;
      }
    }
  }

  // Krok 4: posune částice a ořízne je do rozsahu.
  updatePosition(): void {
    for (let i = 0; i < this.config.popSize; i++) {
      for (let j = 0; j < this.config.dimensions; j++) {
        this.positions[i][j] += this.velocities[i][j];
        this.positions[i][j] = clamp(this.positions[i][j], this.config.bounds[0], this.config.bounds[1]);
      }
    }
  }

  // Krok 5: jedna iterace algoritmu (nahrazuje smyčku z optimize() v notebooku).
  step(): void {
    this.evaluate();
    this.history.push(this.gBestScore);

    if (this.config.inertiaLinear) {
      this.inertia =
        this.config.inertiaStart -
        (this.iteration / this.config.maxIterations) * (this.config.inertiaStart - this.config.inertiaEnd);
    }

    this.updateVelocity();
    this.updatePosition();

    this.iteration++;
  }
}
