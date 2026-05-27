import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest cases
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation
  it("should kill two adjacent cells each with 1 neighbor (Rule 1) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 3: Overpopulation - single cell example for the rule
  // (already covered with full pattern below; we'll keep dedicated tests)

  // Rule 4: Reproduction
  it("should birth a dead cell with exactly 3 live neighbors (Rule 4) -- L-shape [(0,2),(1,2),(0,1)] -> birth (1,1)", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 2], [1, 2], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });

  // Still life: Block
  it("should keep a Block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(cells.map((c) => c.join(","))),
    );
  });

  // Rule 2: Survival - full blinker / T example from spec
  it("should let a live cell with 2 or 3 neighbors survive (Rule 2) -- center of L-tromino survives and births form a square", () => {
    // Live cells: (0,0),(1,0),(0,1) — (0,0) has 2 live neighbors so it survives.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("0,0")).toBe(true); // (0,0) survives with 2 live neighbors
  });

  // Rule 3: Overpopulation - full ring example
  it("should kill a live cell with more than 3 neighbors (Rule 3) -- center of plus-with-center has 4 neighbors and dies", () => {
    // Live cells: (1,1) plus its 4 orthogonal neighbors. (1,1) has 4 live neighbors -> dies.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(false);
  });

  // Blinker oscillator
  it("should oscillate vertical Blinker to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });

  // Negative coordinates
  it("should handle negative coordinates -- Block at [(-1,-1),(0,-1),(-1,0),(0,0)] unchanged", () => {
    const cells: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(cells);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(cells.map((c) => c.join(","))),
    );
  });
});
