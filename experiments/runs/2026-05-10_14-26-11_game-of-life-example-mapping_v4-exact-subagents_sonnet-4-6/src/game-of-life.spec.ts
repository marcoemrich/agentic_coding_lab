import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[true]])).toEqual([[]]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[true, true]])).toEqual([[]]);
  });
  it("should keep a block (2x2) unchanged as a still life", () => {
    const block = [
      [true, true],
      [true, true],
    ];
    expect(nextGeneration(block)).toEqual([
      [true, true],
      [true, true],
    ]);
  });
  it("should transform a vertical blinker to a horizontal blinker", () => {
    const verticalBlinker = [[true], [true], [true]];
    const horizontalBlinker = [[], [true, true, true], []];
    expect(nextGeneration(verticalBlinker)).toEqual(horizontalBlinker);
  });
  it("should create a new live cell when dead cell has exactly 3 live neighbors", () => {
    // Three horizontal cells: dead cell above center has exactly 3 live neighbors
    // and must come alive in a new row
    const grid = [[true, true, true]];
    // The cell above the center (at row -1, col 1) has 3 live neighbors
    // so the next generation should have 3 rows: new top row, middle row, new bottom row
    expect(nextGeneration(grid).length).toBe(3);
  });
});
