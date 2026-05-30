import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input — []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with 0 neighbors (Rule 1: Underpopulation) — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor (Rule 1: Underpopulation) — [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with 2 neighbors (Rule 2: Survival) — center of L-shape survives", () => {
    // L-shape: (0,2) has neighbors (0,1) and (1,2) → 2 live neighbors → survives
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([0, 2]);
  });
  it("should keep a live cell alive with 3 neighbors (Rule 2: Survival) — center of T-shape survives", () => {
    // T-shape: (1,2) has neighbors (0,2),(2,2),(1,1) → 3 live neighbors → survives
    const result = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);
    expect(result).toContainEqual([1, 2]);
  });
  it("should kill a live cell with 4 neighbors (Rule 3: Overpopulation) — center of plus dies", () => {
    // Plus shape: (1,1) has 4 neighbors at (0,1),(2,1),(1,0),(1,2) → dies
    const result = nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2], [1, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should revive a dead cell with exactly 3 live neighbors (Rule 4: Reproduction) — (1,1) becomes alive in L-shape", () => {
    // L-shape from spec: dead (1,1) has neighbors (0,1),(0,2),(1,2) → 3 → reborn
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker to horizontal — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const sortCells = (cs: [number, number][]) =>
      [...cs].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should keep a block stable (still life) — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const sortCells = (cs: [number, number][]) =>
      [...cs].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should handle negative coordinates — blinker at negative positions oscillates correctly", () => {
    const sortCells = (cs: [number, number][]) =>
      [...cs].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Vertical blinker at x=-5, y=-5..-3 → horizontal at y=-4, x=-6..-4
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(result)).toEqual(sortCells([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
