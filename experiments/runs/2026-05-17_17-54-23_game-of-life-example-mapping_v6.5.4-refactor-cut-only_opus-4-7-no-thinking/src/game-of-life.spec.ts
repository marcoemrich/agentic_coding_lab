import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) as still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("should kill an overpopulated cell (more than 3 neighbors)", () => {
    // Center cell (1,1) has 4 live neighbors from the ### / .#. / ### pattern
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    const containsCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(containsCenter).toBe(false);
  });
  it("should bring a dead cell to life with exactly 3 neighbors", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const containsNewlyAlive = result.some(([x, y]) => x === 1 && y === 1);
    expect(containsNewlyAlive).toBe(true);
  });
  it("should handle negative coordinates", () => {
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(expected));
  });
});
