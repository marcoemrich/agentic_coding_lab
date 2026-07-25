import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty input -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single lone cell -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with exactly 2 neighbors alive (survival)", () => {
    // Three cells in L-shape: each has exactly 2 neighbors, all survive
    // Also: dead cell (1,1) has 3 neighbors, gets born (reproduction)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should keep a live cell with exactly 3 neighbors alive (survival)", () => {
    // (0,1) has exactly 3 neighbors [(0,0),(0,2),(1,0)] and survives
    // (0,2) has 1 neighbor → dies; others have 2 → survive
    const result = nextGeneration([[0, 0], [0, 1], [0, 2], [1, 0]]);
    // (0,1) survives with 3 neighbors
    expect(result).toContainEqual([0, 1]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation) -- center cell (1,1) with 4 neighbors dies", () => {
    // (1,1) has 4 live neighbors: (0,0), (1,0), (2,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring dead cell with exactly 3 neighbors to life (reproduction) -- dead cell (1,1) with 3 neighbors becomes alive", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors, gets born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should preserve a 2×2 block unchanged (still life) -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    // 2x2 block: every cell has exactly 3 neighbors, all survive, no births
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map(p => `${p[0]},${p[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should oscillate a blinker (period 2 oscillator) -- vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    // Vertical blinker: 3 cells in a column becomes 3 cells in a row
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(p => `${p[0]},${p[1]}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
});