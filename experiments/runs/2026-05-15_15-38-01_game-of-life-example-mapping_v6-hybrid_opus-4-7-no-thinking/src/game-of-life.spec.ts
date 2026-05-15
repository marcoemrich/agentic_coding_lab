import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]): [number, number][] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (each cell has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("creates a new cell where a dead cell has exactly 3 live neighbors (reproduction)", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const gen1: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });
  it("kills a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors at corners → dies from overpopulation
    const cells: [number, number][] = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    // 2x2 block at negative coordinates - still life
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
