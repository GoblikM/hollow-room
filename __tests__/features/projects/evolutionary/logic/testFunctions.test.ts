import {
  sphere,
  ackley,
  styblinskiTang,
  zakharov,
  rosenbrock,
  michalewicz,
  schwefel,
} from "@/features/projects/evolutionary/logic/testFunctions";

// Známé hodnoty v globálním minimu (nebo snadno spočítatelné) z pso.ipynb.
// toBeCloseTo řeší drobné nepřesnosti v desetinných číslech (float).
describe("testovací funkce", () => {
  test("sphere", () => {
    expect(sphere([0, 0])).toBe(0);
    expect(sphere([1, 2, 3])).toBe(14); // 1 + 4 + 9
  });

  test("ackley", () => {
    expect(ackley([0, 0])).toBeCloseTo(0);
  });

  test("styblinskiTang", () => {
    expect(styblinskiTang([0, 0])).toBe(0);
  });

  test("zakharov", () => {
    expect(zakharov([0, 0])).toBe(0);
    expect(zakharov([1, 1])).toBeCloseTo(9.3125); // 2 + 1.5^2 + 1.5^4
  });

  test("rosenbrock", () => {
    expect(rosenbrock([1, 1])).toBeCloseTo(0); // globální minimum
    expect(rosenbrock([1, 1, 1])).toBeCloseTo(0);
  });

  test("michalewicz", () => {
    expect(michalewicz([2.2, 1.57])).toBeCloseTo(-1.8);
  });

  test("schwefel", () => {
    expect(schwefel([420.9687, 420.9687])).toBeCloseTo(0);
  });
});
