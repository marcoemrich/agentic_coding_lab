import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest cases
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with 0 neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (live cell with < 2 neighbors dies)
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor both die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2: Survival (live cell with 2 or 3 neighbors lives on)
  // Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("Rule 2 Survival: middle cell of 3-in-a-row has 2 live neighbors -> survives -- next gen of [(0,0),(1,0),(2,0)] contains (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });

  // Rule 3: Overpopulation (live cell with > 3 neighbors dies)
  it("Rule 3 Overpopulation: center cell (1,1) with 4 live neighbors dies -- 3x3 minus middle-of-edges, with center", () => {
    // Spec Rule 3 example: ###/.#./### -> center has 4 live neighbors -> dies
    // Live cells: top row (0,2),(1,2),(2,2); center (1,1); bottom row (0,0),(1,0),(2,0).
    // Center (1,1) neighbors: 8 surrounding cells, but middle-of-edges (0,1) and (2,1) are dead.
    // So center has 6 live neighbors -> dies.
    const result = nextGeneration([
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4: Reproduction explicit example
  it("Rule 4 Reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive -- [(0,2),(1,2),(0,1)] -> contains (1,1)", () => {
    // Spec Rule 4 example: ##./#../... -> dead cell (1,1) has 3 live neighbors (0,2),(1,2),(0,1)
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Pattern examples from spec
  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });

  // Negative coordinates (constraint)
  it("should handle negative coordinates -- vertical blinker at [(-5,-5),(-5,-4),(-5,-3)] becomes horizontal [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-6, -4]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
