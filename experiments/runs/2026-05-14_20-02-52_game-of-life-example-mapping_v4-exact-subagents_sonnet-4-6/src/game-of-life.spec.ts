import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toEqual([[1, 1], [1, 0], [1, 2]]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors", () => {
    // (1,0) has 3 neighbors: (0,0),(2,0),(1,1); all cells have 2 or 3 neighbors and survive
    // dead cells (0,1),(1,-1),(2,1) each have exactly 3 live neighbors and are born
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toEqual([[0, 0], [1, 0], [2, 0], [1, 1], [0, 1], [1, -1], [2, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // center (1,1) has 5 neighbors: (0,0),(1,0),(2,0),(0,1),(2,1) - dies
    // (1,0) also has 5 neighbors - dies; others have 3 neighbors - survive
    // dead cells (1,-1) and (1,2) each have exactly 3 live neighbors and are born
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [1, 1]])).toEqual([[0, 0], [2, 0], [0, 1], [2, 1], [1, -1], [1, 2]]);
  });
  it("should make a dead cell alive when it has exactly 3 live neighbors (reproduction)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should keep a 2x2 block unchanged (still life)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
