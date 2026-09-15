import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] when the current generation is []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single-cell example [(0,0)] because the cell has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for the underpopulation example [(0,1),(1,1)] because each live cell has one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) alive when it has exactly 3 live neighbors, as in the survival rule example", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("returns [(0,0),(2,0),(0,1),(2,1),(0,2),(2,2)] for the overpopulation example, removing center cell (1,1)", () => {
    const cells = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]] as [number, number][];

    expect(nextGeneration(cells)).toEqual([[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]);
  });
  it("returns the block [(0,0),(1,0),(0,1),(1,1)] when dead cell (1,1) has exactly 3 neighbors in the reproduction example", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("leaves the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("returns vertical blinker [(0,0),(0,1),(0,2)] after advancing its horizontal generation, completing the two-generation example", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("leaves a block at negative x and y coordinates unchanged, demonstrating an infinite sparse grid in all directions", () => {
    const block = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]] as [number, number][];

    expect(nextGeneration(block)).toEqual(block);
  });
});
