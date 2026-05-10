import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two neighboring cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    // (1,0) has 2 neighbors → survives; (0,0),(2,0) have 1 neighbor → die
    // dead cells (1,-1) and (1,1) each have 3 neighbors → born
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, 0], [1, -1], [1, 1]]);
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    // block: each cell has exactly 3 neighbors → all survive
    // (0,0) neighbors: (1,0),(0,1),(1,1) → 3
    // (1,0) neighbors: (0,0),(0,1),(1,1) → 3
    // (0,1) neighbors: (0,0),(1,0),(1,1) → 3
    // (1,1) neighbors: (0,0),(1,0),(0,1) → 3
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // 3x3 grid: center (1,1) has 8 neighbors → dies; corners have 3 → survive; edges have 5 → die
    // corners: (0,0),(2,0),(0,2),(2,2) each have 3 neighbors → survive
    // edges: (1,0),(0,1),(2,1),(1,2) each have 5 neighbors → die
    // dead cells outside corners with 3 neighbors → born: (-1,1),(1,-1),(3,1),(1,3)
    const grid: [number,number][] = [
      [0,0],[1,0],[2,0],
      [0,1],[1,1],[2,1],
      [0,2],[1,2],[2,2],
    ];
    expect(nextGeneration(grid)).toEqual([[0,0],[2,0],[0,2],[2,2],[-1,1],[1,-1],[3,1],[1,3]]);
  });
  it("should revive a dead cell with exactly 3 neighbors (reproduction)", () => {
    // dead cell (1,1) has 3 live neighbors (0,0),(1,0),(0,1) → becomes alive
    // live cells (0,0),(1,0),(0,1) each have 2 neighbors → survive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should correctly compute blinker oscillator next generation", () => {
    // vertical blinker → horizontal blinker
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[0, 1], [-1, 1], [1, 1]]);
  });
  it("should correctly compute block still life (unchanged)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
});
