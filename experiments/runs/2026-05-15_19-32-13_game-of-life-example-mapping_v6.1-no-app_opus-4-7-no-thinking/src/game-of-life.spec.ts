import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no live cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (each cell has 3 neighbors)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("oscillates a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("kills a live cell with 4 or more neighbors (overpopulation)", () => {
    // Center (1,1) is surrounded by 4 diagonals + a top => 5 neighbors
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2],         [2, 2],
    ];
    const result = nextGeneration(cells);
    // The center cell (1,1) had 7 live neighbors → must die (overpopulation)
    expect(result).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape — dead cell (1,1) has 3 live neighbors → becomes alive
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(lShape))).toEqual(sortCells(expected));
  });
  it("handles negative coordinates correctly", () => {
    // Blinker entirely in negative coordinates: vertical -> horizontal
    const vertical: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
