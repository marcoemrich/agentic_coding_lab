import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for [(0,0)] because a single cell has zero neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for [(0,1),(1,1)] because each cell has one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("returns [(0,0),(1,0),(0,1),(1,1)] when the dead cell (1,1) has exactly three neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps live center (1,1) with three neighbors and reproduces beyond the displayed grid", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1],
    ]);
  });
  it("kills overpopulated center (1,1) while cells with two or three neighbors survive", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0],
      [0, 2], [1, 2], [2, 2], [1, 3],
    ]);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("returns the blinker to [(0,0),(0,1),(0,2)] after two generations", () => {
    const generationOne = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(nextGeneration(generationOne)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns negative-coordinate vertical blinker [(-2,-3),(-2,-2),(-2,-1)] into [(-3,-2),(-2,-2),(-1,-2)]", () => {
    expect(nextGeneration([[-2, -3], [-2, -2], [-2, -1]])).toEqual([
      [-3, -2], [-2, -2], [-1, -2],
    ]);
  });
});
