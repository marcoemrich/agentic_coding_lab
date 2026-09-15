import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] when the input is []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single-cell example [(0,0)] because the cell has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for the underpopulation example [(0,1),(1,1)] because each cell has one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell at (1,1) when it has exactly 2 live neighbors", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("keeps the live center cell at (1,1) in the survival example when it has exactly 3 live neighbors", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("removes the live center cell at (1,1) in the overpopulation example when it has more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("makes dead cell (1,1) alive in the reproduction example and returns [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the blinker horizontal generation back into [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([
      [0, 0], [0, 1], [0, 2],
    ]);
  });
});
