import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for an empty grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only 1 neighbor (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction) -- [(0,0),(1,0),(0,1)] -> adds (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should reproduce a blinker oscillator Gen 0 -> Gen 1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation) -- plus sign center with 4 neighbors dies", () => {
    expect(nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]])).toEqual([
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]);
  });
});