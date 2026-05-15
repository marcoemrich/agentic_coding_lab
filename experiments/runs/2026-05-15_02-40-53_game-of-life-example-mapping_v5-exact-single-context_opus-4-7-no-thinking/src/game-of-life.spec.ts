import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("should kill a live cell with 4 or more neighbors (overpopulation)", () => {
    // Full 3x3 grid: center (1,1) has 8 live neighbors → must die.
    const full3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(full3x3);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has 3 live neighbors → born.
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(lShape);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker translated into negative quadrant.
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
