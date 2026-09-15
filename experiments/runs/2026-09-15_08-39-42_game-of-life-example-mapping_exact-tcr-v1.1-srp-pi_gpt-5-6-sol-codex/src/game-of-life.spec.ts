import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it is underpopulated", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent live cells [(0,1),(1,1)] because each has one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live center cell with exactly 3 live neighbors alive, following the stated Rule 2 outcome despite its inconsistent diagram", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("removes a live center cell with more than 3 live neighbors, following the stated Rule 3 outcome despite its inconsistent counts and full-grid output", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("creates (1,1) from [(0,1),(1,1),(0,0)] to produce [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 0], [0, 0]])).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)] on the second generation", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([
      [0, 0], [0, 1], [0, 2],
    ]);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("handles negative coordinates by evolving [(-2,-2),(-2,-1),(-2,0)] into [(-3,-1),(-2,-1),(-1,-1)]", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });
});
