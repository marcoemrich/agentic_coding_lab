import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2 still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const sortFn = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(vertical).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has 3 live neighbors → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const hasCell = (cell: [number, number]) =>
      result.some(([x, y]) => x === cell[0] && y === cell[1]);
    expect(hasCell([1, 1])).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    // Blinker centered around origin with negative coords: vertical → horizontal
    const vertical: [number, number][] = [[-1, -1], [-1, 0], [-1, 1]];
    const expected: [number, number][] = [[-2, 0], [-1, 0], [0, 0]];
    const sortFn = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(vertical).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
});
