import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep live cell alive with two live neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep live cell alive with three live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill live cell with more than three live neighbors (overpopulation)", () => {
    const result = nextGeneration([[1,1],[0,0],[1,0],[2,0],[0,1],[2,1]]);
    expect(result).not.toContainEqual([1,1]);
  });
  it("should reproduce dead cell with exactly three live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should compute next generation for blinker pattern", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(gen1)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should compute next generation for block still life pattern", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
