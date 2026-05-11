import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cs: [number, number][]) =>
  [...cs].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each with 1 neighbor) due to underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a cell alive when it has 2 or 3 live neighbors (survival)", () => {
    // Vertical blinker: center cell (0,1) has 2 live neighbors
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // 2x2 block + extra cell above: (0,0) has 4 live neighbors → dies
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1], [0, -1]]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has exactly 3 live neighbors → becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should leave a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at negative coordinates → horizontal blinker
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(result)).toEqual(sortCells([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
