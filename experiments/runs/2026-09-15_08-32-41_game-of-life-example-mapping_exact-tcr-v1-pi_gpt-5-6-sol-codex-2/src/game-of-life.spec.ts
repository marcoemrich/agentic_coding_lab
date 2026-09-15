import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for [(0,1),(1,1)] because both live cells have only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("keeps the example's center cell (1,1) alive when it has exactly 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("creates dead cell (1,1) and returns the block [(0,0),(1,0),(0,1),(1,1)] when it has exactly 3 neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("removes a live center cell (1,1) with more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)] on generation 2", () => {
    const generation1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(nextGeneration(generation1)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("handles negative coordinates by evolving [(-2,-2),(-2,-1),(-2,0)] to [(-3,-1),(-2,-1),(-1,-1)]", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });
});
