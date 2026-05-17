import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block stable (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sortCells = (c: Cell[]) => [...c].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const sortCells = (c: Cell[]) => [...c].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("should handle negative coordinates correctly", () => {
    const vertical: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    const sortCells = (c: Cell[]) => [...c].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
