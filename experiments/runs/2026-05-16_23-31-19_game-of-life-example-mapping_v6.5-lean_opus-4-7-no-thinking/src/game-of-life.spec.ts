import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) stable as a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    const input: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // L-shape: (0,1) and (1,1) each have 4 live neighbors → die
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]];
    const result = nextGeneration(input);
    const resultKeys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultKeys.has("0,1")).toBe(false);
    expect(resultKeys.has("1,1")).toBe(false);
  });
  it("should handle negative coordinates", () => {
    const input: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
});
