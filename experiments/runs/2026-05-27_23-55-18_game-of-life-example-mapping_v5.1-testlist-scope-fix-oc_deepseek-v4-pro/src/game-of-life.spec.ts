import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input (no living cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single living cell with no neighbors -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should keep a 2x2 block unchanged (still life) -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should kill cells with fewer than 2 neighbors (underpopulation) -- [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should birth a dead cell with exactly 3 live neighbors (reproduction) -- [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should keep live cells with 2 or 3 neighbors alive (survival pattern) -- [(0,0),(1,0),(2,0),(1,2)] → [(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toEqual([[1, 0], [1, 1]]);
  });

  it("should kill live cells with more than 3 neighbors (overpopulation) -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] → [(0,0),(2,0),(0,1),(2,1),(0,2),(2,2)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).toEqual([[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]);
  });

  it("should produce correct next generation for a blinker oscillator Gen 0 → Gen 1 -- [(1,0),(1,1),(1,2)] → [(0,1),(1,1),(2,1)]", () => {
    expect(nextGeneration([[1, 0], [1, 1], [1, 2]])).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
});