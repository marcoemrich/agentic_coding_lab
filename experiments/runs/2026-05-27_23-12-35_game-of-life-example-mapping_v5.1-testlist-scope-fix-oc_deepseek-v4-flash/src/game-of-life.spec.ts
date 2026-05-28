import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation: < 2 neighbors) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with 1 neighbor each (underpopulation) -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a live cell with 2 neighbors survive -- [(1,0) survives, neighbors born too]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should let a live cell with 3 neighbors survive -- [T-shape: (0,0),(2,0),(1,2) also born]", () => {
    expect(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1]])).toEqual([[1, 0], [0, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
  });
  it("should kill a live cell with 4+ neighbors (overpopulation) -- [full 3x3: corners + 4 adj dead cells]", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2]
    ])).toEqual([[0, 0], [1, -1], [-1, 1], [2, 0], [3, 1], [0, 2], [2, 2], [1, 3]]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction) -- [(0,0),(1,0),(0,1)] -> also (1,1) born", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should oscillate blinker pattern -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should keep block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should handle cells with negative coordinates -- [blinker second gen at (-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});