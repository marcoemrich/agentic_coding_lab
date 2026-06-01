import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation (live cell with < 2 neighbors dies)
  it("two adjacent cells each have 1 neighbor and die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival (live cell with 2 or 3 neighbors lives on)
  it("live cell with 3 neighbors survives — (1,1) stays alive", () => {
    // (1,1) is alive with live neighbors (0,0),(2,0),(0,2) → 3 neighbors → survives
    const next = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2]]);
    expect(next).toContainEqual([1, 1]);
  });

  // Rule 3 – Overpopulation (live cell with > 3 neighbors dies)
  it("live cell with 4 neighbors dies (overpopulation) — (1,1) removed", () => {
    // (1,1) alive with live neighbors (0,0),(2,0),(0,2),(2,2) → 4 neighbors → dies
    const next = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });

  // Rule 4 – Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("dead cell with exactly 3 neighbors becomes alive — (1,1) born", () => {
    // L-shape: (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors → born
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });

  // Pattern examples
  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(next)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("block is a still life — unchanged", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  // Negative coordinates
  it("handles negative coordinates — blinker in negative space", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const next = nextGeneration([[-1, -1], [-1, 0], [-1, 1]]);
    expect(sortCells(next)).toEqual(sortCells([[-2, 0], [-1, 0], [0, 0]]));
  });
});
