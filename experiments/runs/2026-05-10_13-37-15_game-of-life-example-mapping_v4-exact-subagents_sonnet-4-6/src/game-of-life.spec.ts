import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[true]])).toEqual([]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[true, true]])).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors", () => {
    const grid = [[true, true, true]];
    const result = nextGeneration(grid);
    expect(result[0][1]).toBe(true);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors", () => {
    const grid = [[true, true], [true, true]];
    const result = nextGeneration(grid);
    expect(result[0][0]).toBe(true);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // 3x3 grid of all live cells - center cell has 8 neighbors and should die
    const grid = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    const result = nextGeneration(grid);
    // Center cell at [1][1] has 8 neighbors, should die from overpopulation
    expect(result[1][1]).toBe(false);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const grid = [
      [true, true, false],
      [true, false, false],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    expect(result[1][1]).toBe(true);
  });
  it("should keep a block (2x2) unchanged as a still life", () => {
    expect(nextGeneration([[true, true], [true, true]])).toEqual([[true, true], [true, true]]);
  });
  it("should transform a blinker from vertical to horizontal", () => {
    const vertical = [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ];
    const horizontal = [
      [false, false, false],
      [true,  true,  true],
      [false, false, false],
    ];
    expect(nextGeneration(vertical)).toEqual(horizontal);
  });
});
