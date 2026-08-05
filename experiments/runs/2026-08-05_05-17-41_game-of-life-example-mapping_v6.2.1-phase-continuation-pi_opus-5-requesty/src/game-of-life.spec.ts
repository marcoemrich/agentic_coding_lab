import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: live center cell with 3 live neighbors survives -- [(0,0),(1,0),(2,0),(1,1)] -> includes (1,1)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: live center cell with 4 live neighbors dies -- [(0,0),(1,0),(2,0),(1,1),(1,2)] -> excludes (1,1)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("Blinker gen 0 -> gen 1: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("Blinker gen 1 -> gen 2: [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["0,0", "0,1", "0,2"]),
    );
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("should handle negative coordinates -- block at [(-1,-1),(0,-1),(-1,0),(0,0)] stays unchanged", () => {
    const result = nextGeneration([
      [-1, -1],
      [0, -1],
      [-1, 0],
      [0, 0],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["-1,-1", "0,-1", "-1,0", "0,0"]),
    );
  });
});
