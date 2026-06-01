import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("an empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation (live cell with < 2 neighbors dies)
  it("two adjacent live cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival (live cell with 2 or 3 neighbors lives on)
  it("a live cell with exactly 3 live neighbors survives — (1,1) lives on", () => {
    // live cells: top row (0,0),(1,0),(2,0) plus center (1,1).
    // (1,1) has exactly 3 live neighbors (the top row) → survives.
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });

  // Rule 3 - Overpopulation (live cell with > 3 neighbors dies)
  it("a live cell with more than 3 live neighbors dies — center (1,1) of ### / .#. / ### dies", () => {
    // live cells: ### / .#. / ### → (1,1) has 6 live neighbors → overpopulation.
    const next = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("a dead cell with exactly 3 live neighbors becomes alive — (1,1) is born", () => {
    // live cells: ## / #.. → (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors → born.
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
  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  // Negative coordinates
  it("handles negative coordinates correctly — blinker in negative space oscillates", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const next = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(next)).toEqual(
      sortCells([[-6, -4], [-5, -4], [-4, -4]]),
    );
  });
});
