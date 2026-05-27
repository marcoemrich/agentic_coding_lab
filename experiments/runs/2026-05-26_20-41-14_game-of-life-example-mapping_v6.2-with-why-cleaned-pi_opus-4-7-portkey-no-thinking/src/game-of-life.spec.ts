import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest case
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1: Underpopulation
  it("should kill a single live cell with 0 neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2: Survival (covered via blinker/block patterns)

  // Rule 3: Overpopulation
  it("should kill the center cell of a 3x3 full block when it has 4+ neighbors -- center (1,1) dies", () => {
    const fullBlock3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullBlock3x3);
    const containsCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(containsCenter).toBe(false);
  });

  // Rule 4: Reproduction
  it("should bring a dead cell with exactly 3 neighbors to life -- L-shape produces (1,1)", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    const containsNewCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(containsNewCell).toBe(true);
  });

  // Pattern: Block (still life) - tests Rule 2 (survival with 3 neighbors)
  it("should leave a 2x2 block unchanged (still life) -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });

  // Pattern: Blinker (oscillator) - tests Rules 1, 2, 4 with negative coords
  it("should transform vertical blinker into horizontal blinker -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const verticalBlinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
});
