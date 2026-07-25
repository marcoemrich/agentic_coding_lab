import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest case: empty grid
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (underpopulation, 0 neighbors)
  it("should kill a single live cell — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation (live cell with < 2 neighbors dies)
  it("should kill both cells with only 1 neighbor each — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4 – Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("should bring a dead cell with exactly 3 neighbors to life — (1,1) becomes alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 2 – Survival (live cell with 2 or 3 neighbors lives on)
  it("should keep a live cell (0,0) with 2 neighbors alive", () => {
    // (0,0) has live neighbors (1,0) and (0,1) → survives
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
  });

  // Rule 3 – Overpopulation (live cell with > 3 neighbors dies)
  it("should kill the center cell (1,1) with 4 neighbors", () => {
    // (1,1) live with 4 live neighbors at the corners → dies
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Block (still life) — unchanged
  it("should leave a block unchanged — [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });

  // Blinker (oscillator) — Gen 0 → Gen 1
  it("should transform blinker [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });

  // Negative coordinates handled
  it("should handle negative coordinates (blinker Gen 1 → Gen 2)", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([0, 2]);
  });
});
