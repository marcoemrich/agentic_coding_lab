import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Degenerate base case
  it("should return [] for an empty input (no living cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("should kill a single isolated cell with 0 neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor (underpopulation) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Block still life (survival with 3 neighbors each)
  it("should keep a 2x2 block unchanged (still life) — [(0,0),(1,0),(0,1),(1,1)] → same set", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  // Rule 2 - Survival: a live cell with 2 neighbors survives (vertical blinker center)
  it("should let live center cell (0,1) with 2 live neighbors survive — Rule 2", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[0, 1]]));
  });

  // Rule 4 - Reproduction
  it("should bring dead cell (1,1) to life when it has exactly 3 live neighbors (L-shape) — Rule 4: [(0,0),(1,0),(0,1)] produces (1,1) alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });

  // Rule 3 - Overpopulation
  it("should kill center cell (1,1) with 4 live neighbors (full 3x3 ring + center) — Rule 3", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });

  // Blinker oscillator - vertical to horizontal
  it("should oscillate a vertical blinker into a horizontal one — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });

  // Negative coordinates
  it("should handle negative coordinates correctly (blinker output contains (-1,1) — verifies infinite grid in negative direction)", () => {
    const result = nextGeneration([[-2, -2], [-1, -2], [0, -2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, -3], [-1, -2], [-1, -1]]));
  });
});
