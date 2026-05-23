import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation, each has 1 neighbor) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains stable — [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("live cell with 4+ neighbors dies (overpopulation) — center (1,1) of 3x3 block dies", () => {
    const grid: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(grid);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — [(0,0),(1,0),(0,1)] gives (1,1) alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("live cell with 2 neighbors survives (rule 2) — corner (0,0) of L-shape [(0,0),(1,0),(0,1)] survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(expected));
  });
  it("handles negative coordinates — blinker at negative offsets oscillates correctly", () => {
    const vertical: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
    const expected: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(expected));
  });
});
