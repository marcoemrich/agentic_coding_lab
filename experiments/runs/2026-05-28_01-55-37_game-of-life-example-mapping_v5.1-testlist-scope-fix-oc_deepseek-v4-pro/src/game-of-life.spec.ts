import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty grid for empty input -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single cell with no neighbors -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill cells with fewer than 2 neighbors (underpopulation) -- [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should revive a dead cell with exactly 3 neighbors (reproduction) -- [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should keep cells with 2-3 neighbors alive (survival) -- [(0,0),(1,0),(2,0),(1,2)] → [(1,-1),(1,0),(0,1),(2,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toEqual([[1, -1], [1, 0], [0, 1], [2, 1]]);
  });

  it("should kill cells with more than 3 neighbors (overpopulation) -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] → [(0,0),(2,0),(0,2),(2,2)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).toEqual([[1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3]]);
  });

  it("should preserve a 2x2 block (still life) -- [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should oscillate the blinker pattern -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});