import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - nextGeneration", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should preserve a block pattern [(0,0),(1,0),(0,1),(1,1)] as still life", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sortCells = (cells: Array<[number, number]>) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(input));
  });
  it("should transform a vertical blinker [(0,0),(0,1),(0,2)] into a horizontal blinker [(-1,1),(0,1),(1,1)]", () => {
    const input: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    const sortCells = (cells: Array<[number, number]>) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("should kill a live cell with 4 live neighbors (overpopulation)", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    const input: Array<[number, number]> = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Array<[number, number]> = [[-6, -4], [-5, -4], [-4, -4]];
    const sortCells = (cells: Array<[number, number]>) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
});
