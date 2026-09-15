import { describe, expect, it } from "vitest";

import { type Cell, nextGeneration } from "./game-of-life.js";

function coordinateSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single-cell example [(0,0)] because it has 0 neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for the underpopulation example [(0,1),(1,1)] because each cell has 1 neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) alive in the survival example because it has exactly 3 live neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("removes the center cell (1,1) from the overpopulation example because it has more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("creates (1,1) in the reproduction example and returns the resulting four-cell block", () => {
    const next = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(coordinateSet(next)).toEqual(new Set(["0,1", "1,1", "0,2", "1,2"]));
  });
  it("transforms the vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(coordinateSet(next)).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("transforms the blinker back to [(0,0),(0,1),(0,2)] after a second generation", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(coordinateSet(nextGeneration(first))).toEqual(new Set(["0,0", "0,1", "0,2"]));
  });
  it("leaves the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(coordinateSet(nextGeneration(block))).toEqual(coordinateSet(block));
  });
});
