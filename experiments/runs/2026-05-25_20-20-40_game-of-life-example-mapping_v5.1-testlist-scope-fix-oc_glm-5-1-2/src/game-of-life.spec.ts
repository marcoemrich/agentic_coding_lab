import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid returns empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single cell with 0 neighbors dies (Rule 1 underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent cells each with 1 neighbor die (Rule 1, spec example) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("block still life -- cells with 2 neighbors survive (Rule 2) -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });

  it("dead cell with exactly 3 neighbors becomes alive (Rule 4 reproduction, spec example) -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });

  it("live cell with more than 3 neighbors dies (Rule 3 overpopulation) -- [(0,0),(1,0),(0,1),(1,1),(1,2)] -> [(0,0),(1,0),(1,2),(0,2),(2,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1], [1, 2]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [1, 2], [0, 2], [2, 1]].sort());
  });

  it("blinker oscillator Gen 0 -> Gen 1 (spec example) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });

  it("blinker oscillator Gen 1 -> Gen 2 (spec example) -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [0, 2]].sort());
  });

  it("handles negative coordinates -- [(-1,-1),(0,-1),(-1,0)] -> [(-1,-1),(0,-1),(-1,0),(0,0)]", () => {
    const result = nextGeneration([[-1, -1], [0, -1], [-1, 0]]);
    expect(result.sort()).toEqual([[-1, -1], [0, -1], [-1, 0], [0, 0]].sort());
  });
});
