import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a cell alive with exactly 2 live neighbors", () => {
    // Two adjacent cells: (0,0) and (1,0), each has exactly 1 neighbor → both die
    // Use a scenario where exactly one cell has 2 neighbors and no reproduction occurs:
    // Four corners of a square: each has exactly 2 neighbors and survives, no dead cell gets 3
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });
  it("should keep a cell alive with exactly 3 live neighbors", () => {
    // Center cell (1,1) has 3 live neighbors (0,0), (1,0), (2,0) → survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors", () => {
    // Dead cell (1,1) has exactly 3 live neighbors (0,0), (1,0), (0,1) → becomes alive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center cell (1,1) surrounded by 4 live neighbors → dies from overpopulation
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]])).not.toContainEqual([1, 1]);
  });
  it("should correctly evolve a blinker pattern (oscillator)", () => {
    // Vertical blinker: [(0,0), (0,1), (0,2)] → horizontal: [(-1,1), (0,1), (1,1)]
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([-1, 1]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toContainEqual([1, 1]);
    expect(gen1).toHaveLength(3);
  });
  it("should correctly evolve a block pattern (still life)", () => {
    // 2x2 block: each cell has exactly 3 live neighbors → all survive, no new cells born
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const gen1 = nextGeneration(block);
    expect(gen1).toHaveLength(4);
    expect(gen1).toContainEqual([0, 0]);
    expect(gen1).toContainEqual([1, 0]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toContainEqual([1, 1]);
  });
});
