export type TestFunction = (input: number[]) => number;

export const sphere: TestFunction = (x) => x.reduce((sum, v) => sum + v * v, 0);

export const ackley: TestFunction = (x, a = 20, b = 0.2, c = 2 * Math.PI) => {
  const d = x.length; // len(x)
  const sum1 = x.reduce((s, v) => s + v * v, 0); // sum(x[i]**2)
  const sum2 = x.reduce((s, v) => s + Math.cos(c * v), 0); // sum(cos(c*x[i]))
  return -a * Math.exp(-b * Math.sqrt(sum1 / d)) - Math.exp(sum2 / d) + a + Math.exp(1);
};

export const styblinskiTang: TestFunction = (x) => x.reduce((sum, v) => sum + v ** 4 - 16 * v ** 2 + 5 * v, 0) * 0.5;

export const zakharov: TestFunction = (x) => {
  const sum1 = x.reduce((sum, currentValue) => sum + currentValue ** 2, 0);
  const sum2 = x.reduce((sum, currentValue, currentIndex) => sum + 0.5 * (currentIndex + 1) * currentValue, 0);
  return sum1 + sum2 ** 2 + sum2 ** 4;
};

export const rosenbrock: TestFunction = (x) => {
  let sum = 0;
  for (let i = 0; i < x.length - 1; i++) {
    sum += 100 * (x[i + 1] - x[i] ** 2) ** 2 + (x[i] - 1) ** 2;
  }
  return sum;
};

export const michalewicz: TestFunction = (input, m = 10) => {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += Math.sin(input[i]) * Math.sin(((i + 1) * input[i] ** 2) / Math.PI) ** (2 * m);
  }
  return -sum;
};

export const schwefel: TestFunction = (input) => {
  return (
    418.9829 * input.length -
    input.reduce((sum, currentValue) => sum + currentValue * Math.sin(Math.sqrt(Math.abs(currentValue))), 0)
  );
};

export type TestFunctionEntry = {
  fn: TestFunction;
  bounds: [number, number];
  label: string;
};

export const TEST_FUNCTIONS: Record<string, TestFunctionEntry> = {
  sphere: { fn: sphere, bounds: [-5.12, 5.12], label: "Sphere" },
  ackley: { fn: ackley, bounds: [-32.768, 32.768], label: "Ackley" },
  styblinskiTang: { fn: styblinskiTang, bounds: [-5, 5], label: "Styblinski-Tang" },
  zakharov: { fn: zakharov, bounds: [-5, 10], label: "Zakharov" },
  rosenbrock: { fn: rosenbrock, bounds: [-5, 10], label: "Rosenbrock" },
  michalewicz: { fn: michalewicz, bounds: [0, Math.PI], label: "Michalewicz" },
  schwefel: { fn: schwefel, bounds: [-500, 500], label: "Schwefel" },
};

/* ============================================================================
 * ALTERNATIVNÍ ZÁPIS (jen na ukázku, celé zakomentované)
 * ----------------------------------------------------------------------------
 * Ten samý skript, ale psaný "klasickým" stylem:
 *   - klíčové slovo `function` místo `const jmeno = (...) =>`
 *   - typy vypsané ručně u KAŽDÉHO parametru a u návratu (`: number[]`, `: number`),
 *     protože bez aliasu `: TestFunction` je TS sám nedomyslí
 * Chování je úplně stejné jako verze nahoře.
 * ============================================================================

// sphere — jednořádkové tělo teď potřebuje { } a return (u function se nedá
// vynechat tak jako u šipky)
export function sphere(x: number[]): number {
  return x.reduce((sum, v) => sum + v * v, 0);
}

export function ackley(x: number[], a = 20, b = 0.2, c = 2 * Math.PI): number {
  const d = x.length;
  const sum1 = x.reduce((s, v) => s + v * v, 0);
  const sum2 = x.reduce((s, v) => s + Math.cos(c * v), 0);
  return -a * Math.exp(-b * Math.sqrt(sum1 / d)) - Math.exp(sum2 / d) + a + Math.exp(1);
}

export function styblinskiTang(x: number[]): number {
  return x.reduce((sum, v) => sum + v ** 4 - 16 * v ** 2 + 5 * v, 0) * 0.5;
}

export function zakharov(x: number[]): number {
  const sum1 = x.reduce((sum, v) => sum + v ** 2, 0);
  const sum2 = x.reduce((sum, v, i) => sum + 0.5 * (i + 1) * v, 0);
  return sum1 + sum2 ** 2 + sum2 ** 4;
}

export function rosenbrock(x: number[]): number {
  let sum = 0;
  for (let i = 0; i < x.length - 1; i++) {
    sum += 100 * (x[i + 1] - x[i] ** 2) ** 2 + (x[i] - 1) ** 2;
  }
  return sum;
}

export function michalewicz(x: number[], m = 10): number {
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += Math.sin(x[i]) * Math.sin(((i + 1) * x[i] ** 2) / Math.PI) ** (2 * m);
  }
  return -sum;
}

export function schwefel(x: number[]): number {
  return (
    418.9829 * x.length -
    x.reduce((sum, v) => sum + v * Math.sin(Math.sqrt(Math.abs(v))), 0)
  );
}

// Registry je stejný — jen odkazuje na funkce výše. Alias TestFunctionEntry
// můžeš použít oba způsoby zápisu funkcí, mapě je to jedno.
export const TEST_FUNCTIONS: Record<string, TestFunctionEntry> = {
  sphere: { fn: sphere, bounds: [-5.12, 5.12], label: "Sphere" },
  ackley: { fn: ackley, bounds: [-32.768, 32.768], label: "Ackley" },
  styblinskiTang: { fn: styblinskiTang, bounds: [-5, 5], label: "Styblinski-Tang" },
  zakharov: { fn: zakharov, bounds: [-5, 10], label: "Zakharov" },
  rosenbrock: { fn: rosenbrock, bounds: [-5, 10], label: "Rosenbrock" },
  michalewicz: { fn: michalewicz, bounds: [0, Math.PI], label: "Michalewicz" },
  schwefel: { fn: schwefel, bounds: [-500, 500], label: "Schwefel" },
};

 * ========================================================================== */
