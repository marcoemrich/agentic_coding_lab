import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- returns []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell (0,0) dies from underpopulation -- returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: horizontal pair (0,1),(1,1) each with 1 neighbor dies -- returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: center cell (1,1) with 3 neighbors survives -- config A [(0,1),(1,0),(1,1),(2,1)] -> [(0,0),(1,0),(2,0),(0,1),(1,1),(2,1),(1,2)]", () => {
    expect(nextGeneration([[0, 1], [1, 0], [1, 1], [2, 1]])).toEqual([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
  });
  it("Rule 3 overpopulation: center cell (1,1) in 3x3 ring with 8 neighbors dies -- ring -> hole", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]])).toEqual([[1, -1], [0, 0], [2, 0], [-1, 1], [3, 1], [0, 2], [2, 2], [1, 3]]);
  });
  it("Rule 3 overpopulation: center cell (1,1) with 4 neighbors dies (spec example) -- plus shape -> ring", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).toEqual([[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
  });
  it("Rule 4 reproduction: dead cell (1,1) with exactly 3 neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("Blinker Gen0 [(0,0),(0,1),(0,2)] -> Gen1 [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("Block still life [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("handles negative coordinates -- horizontal line [(-3,0),(-2,0),(-1,0)] -> [(-2,-1),(-2,0),(-2,1)]", () => {
    expect(nextGeneration([[-3, 0], [-2, 0], [-1, 0]])).toEqual([[-2, -1], [-2, 0], [-2, 1]]);
  });
});