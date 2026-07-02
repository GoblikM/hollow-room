import { worldToPixel, computeGrid } from "@/features/projects/evolutionary/logic/landscape";
import { sphere } from "@/features/projects/evolutionary/logic/testFunctions";

test("worldToPixel mapuje na plátno", () => {
  expect(worldToPixel(-5, [-5, 5], 100)).toBe(0);
  expect(worldToPixel(5, [-5, 5], 100)).toBe(100);
  expect(worldToPixel(0, [-5, 5], 100)).toBe(50);
});

test("computeGrid navzorkuje krajinu", () => {
  const grid = computeGrid(sphere, [-5, 5], 3); // 3×3: souřadnice -5, 0, 5
  expect(grid.values).toHaveLength(3);
  expect(grid.values[0]).toHaveLength(3);
  expect(grid.min).toBe(0); // střed (0,0): sphere = 0
  expect(grid.max).toBe(50); // roh (±5,±5): 25 + 25
});
