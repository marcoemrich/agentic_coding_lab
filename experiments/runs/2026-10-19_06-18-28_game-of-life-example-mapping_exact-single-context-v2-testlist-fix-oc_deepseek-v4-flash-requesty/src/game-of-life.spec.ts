import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array for an empty grid ([] -> [])", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 - should kill a single live cell with 0 neighbors ([(0,0)] -> [])", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - should kill two adjacent cells with 1 neighbor each ([(0,1),(1,1)] -> [])", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 - should birth a dead cell with exactly 3 live neighbors (L-shape [(0,0),(1,0),(0,1)] -> [(0,0),(0,1),(1,0),(1,1)])", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Rule 2 - should keep live cells with exactly 3 neighbors alive (block [(0,0),(1,0),(0,1),(1,1)] -> unchanged)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Rule 2/4 - blinker Gen0 -> Gen1 vertical to horizontal ([(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)])", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("Blinker - should oscillate back on Gen2 ([(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)])", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("Rule 3 - should kill a live cell with more than 3 neighbors (plus [(0,0),(0,1),(0,-1),(1,0),(-1,0)] -> [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]])", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]])).toEqual([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);
  });
  it("should handle negative coordinates (block at [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] -> unchanged)", () => {
    expect(nextGeneration([[-2, -2], [-1, -2], [-2, -1], [-1, -1]])).toEqual([[-2, -2], [-2, -1], [-1, -2], [-1, -1]]);
  });
});