import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest case: empty grid
  it("should return empty for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (underpopulation, 0 neighbors)
  it("should kill a single cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation: pair each with 1 neighbor dies
  it("should kill both cells of a pair with 1 neighbor each — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival: live cell with 2 or 3 neighbors lives on
  it("should keep a live cell alive with 2 neighbors — center (1,0) survives", () => {
    // Horizontal row of 3; center (1,0) has 2 live neighbors → survives.
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });

  // Rule 4 – Reproduction: dead cell with exactly 3 neighbors becomes alive
  it("should bring a dead cell to life with exactly 3 neighbors — (1,1) becomes alive", () => {
    // Dead cell (1,1) has live neighbors (0,0),(1,0),(0,1) → exactly 3 → born.
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });

  // Rule 3 – Overpopulation: live cell with > 3 neighbors dies
  it("should kill a live cell with 4 neighbors — center (1,1) dies", () => {
    // Center (1,1) is live with 4 orthogonal live neighbors → overpopulation.
    expect(
      nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]),
    ).not.toContainEqual([1, 1]);
  });

  // Pattern: Block still life
  it("should keep a block unchanged — [(0,0),(1,0),(0,1),(1,1)] stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) expect(result).toContainEqual(cell);
  });

  // Pattern: Blinker oscillator (exercises negative coordinates)
  it("should oscillate a blinker — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    for (const cell of [[-1, 1], [0, 1], [1, 1]] as Cell[]) {
      expect(result).toContainEqual(cell);
    }
  });
});
