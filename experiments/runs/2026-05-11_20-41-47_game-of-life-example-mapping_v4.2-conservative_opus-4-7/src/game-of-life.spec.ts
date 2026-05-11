import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 - Survival: center cell with 3 live neighbors survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("Rule 3 - Overpopulation: center cell with 4 live neighbors dies", () => {
    expect(
      nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]])
    ).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("Block (still life): 2x2 block remains unchanged", () => {
    const sortCells = (cells: number[][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker (oscillator): vertical blinker becomes horizontal blinker", () => {
    const sortCells = (cells: number[][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
});
