import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell by underpopulation -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep a block still life unchanged -- [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should kill isolated adjacent cells by underpopulation -- [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should transform a horizontal three-cell line into a vertical line -- [(0,1), (1,1), (2,1)] -> [(1,0), (1,1), (1,2)]", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("should let a live cell with 3 neighbors survive -- center of [(0,0), (1,0), (2,0), (1,1)] -> expanded T", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toEqual([[1, -1], [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]);
  });
  it("should kill an overpopulated cell with 4 neighbors -- center of 3x3 block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]])).toEqual([[1, -1], [0, 0], [2, 0], [-1, 1], [3, 1], [0, 2], [2, 2], [1, 3]]);
  });
  it("should reproduce a dead cell with exactly 3 neighbors -- [(0,2), (1,1), (2,1)] -> [(1,1), (1,2)]", () => {
    expect(nextGeneration([[0, 2], [1, 1], [2, 1]])).toEqual([[1, 1], [1, 2]]);
  });
  it("should transform blinker vertical to horizontal -- [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should transform blinker horizontal back to vertical -- [(-1,1), (0,1), (1,1)] -> [(0,0), (0,1), (0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("should handle negative coordinates correctly -- [(-1,-1), (0,-1), (-1,0), (0,0)] unchanged", () => {
    expect(nextGeneration([[-1, -1], [0, -1], [-1, 0], [0, 0]])).toEqual([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
  });
});
