import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (each cell has exactly 3 neighbors)", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const asSet = (cells: Array<[number, number]>) =>
      new Set(cells.map(([x, y]) => `${x},${y}`));
    expect(asSet(result)).toEqual(asSet(block));
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    const asSet = (cells: Array<[number, number]>) =>
      new Set(cells.map(([x, y]) => `${x},${y}`));
    expect(asSet(nextGeneration(vertical))).toEqual(asSet(expected));
  });
  it("kills a live cell with 4 or more neighbors (overpopulation)", () => {
    // Pattern: ### / .#. / ### — center cell (1,1) has 4 live neighbors
    const cells: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    const asSet = (c: Array<[number, number]>) =>
      new Set(c.map(([x, y]) => `${x},${y}`));
    expect(asSet(result).has("1,1")).toBe(false);
  });
  it("brings a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    // From prompt: ## / #. / .. → dead cell (1,1) has 3 live neighbors at (0,0),(1,0),(0,1)
    const cells: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const asSet = (c: Array<[number, number]>) =>
      new Set(c.map(([x, y]) => `${x},${y}`));
    expect(asSet(result).has("1,1")).toBe(true);
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker at negative coords: (-5,-5), (-5,-4), (-5,-3)
    // Should become horizontal: (-6,-4), (-5,-4), (-4,-4)
    const vertical: Array<[number, number]> = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Array<[number, number]> = [[-6, -4], [-5, -4], [-4, -4]];
    const asSet = (c: Array<[number, number]>) =>
      new Set(c.map(([x, y]) => `${x},${y}`));
    expect(asSet(nextGeneration(vertical))).toEqual(asSet(expected));
  });
});
