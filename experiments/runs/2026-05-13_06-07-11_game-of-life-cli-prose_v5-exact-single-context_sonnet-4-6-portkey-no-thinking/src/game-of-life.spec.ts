import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two live cells that are neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [0, 1]])).toEqual([]);
  });
  it("should reproduce a dead cell with exactly three live neighbors", () => {
    // Horizontal blinker: [0,0], [1,0], [2,0]
    // Dead cell [1,1] has 3 live neighbors → born
    // Dead cell [1,-1] has 3 live neighbors → born
    // [1,0] has 2 live neighbors → survives
    // [0,0] and [2,0] each have 1 live neighbor → die
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a 2x2 block stable (each cell has exactly 3 live neighbors)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
