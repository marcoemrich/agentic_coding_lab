import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should kill a single live cell with no neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: two adjacent live cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Rule 2 - Survival: live cell with exactly 3 live neighbors lives on -- center (1,1) of T-tetromino [(0,0),(1,0),(2,0),(1,1)] survives", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 - Overpopulation: live cell with 4 live neighbors dies -- center (1,1) of X pattern [(0,0),(2,0),(1,1),(0,2),(2,2)] dies", () => {
    const result = nextGeneration([
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] -> unchanged [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker: vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    ).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker oscillates: horizontal [(-1,1),(0,1),(1,1)] -> vertical [(0,0),(0,1),(0,2)]", () => {
    expect(
      nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
});
