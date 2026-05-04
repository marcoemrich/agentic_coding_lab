import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[1]])).toEqual([]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors", () => {
    expect(nextGeneration([[1, 1, 1]])).toEqual([[1], [1], [1]]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors", () => {
    // 2x2 block: each live cell has exactly 3 live neighbors, all should survive
    expect(nextGeneration([[1, 1], [1, 1]])).toEqual([[1, 1], [1, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center cell has 4 live neighbors (up, down, left, right) - dies from overpopulation
    expect(nextGeneration([[0, 1, 0], [1, 1, 1], [0, 1, 0]])).toEqual([[1, 1, 1], [1, 0, 1], [1, 1, 1]]);
  });
  it("should reproduce a dead cell with exactly 3 live neighbors", () => {
    // Dead cell at (0,0) with exactly 3 live neighbors: (0,1), (1,0), (1,1)
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([[1, 1], [1, 1]]);
  });
  it("should transform a blinker (3 cells in a row) to next generation (3 cells in a column)", () => {
    // Horizontal blinker: 3 cells in a row -> vertical blinker: 3 cells in a column
    expect(nextGeneration([[1, 1, 1]])).toEqual([[1], [1], [1]]);
  });
  it("should keep a block (2x2 square) unchanged as a still life", () => {
    // A 2x2 block is a classic still life: each live cell has exactly 3 live neighbors
    expect(nextGeneration([[1, 1], [1, 1]])).toEqual([[1, 1], [1, 1]]);
  });
});
