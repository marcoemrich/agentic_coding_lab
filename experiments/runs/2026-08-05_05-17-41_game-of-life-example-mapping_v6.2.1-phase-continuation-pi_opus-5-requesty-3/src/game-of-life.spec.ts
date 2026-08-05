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
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live center cell with 3 live neighbors survives -- [(0,0),(1,0),(2,0),(1,1)] -> includes (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: center cell with 4 live neighbors dies -- 3x3 ring plus center -> center (1,1) not alive", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> includes (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(String))).toEqual(new Set(block.map(String)));
  });
  it("Blinker oscillates from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(String)),
    );
    expect(result).toHaveLength(3);
  });
  it("Blinker returns to vertical after two generations -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [0, 1], [0, 2]].map(String)),
    );
    expect(result).toHaveLength(3);
  });
  it("should handle negative coordinates -- block at [(-1,-1),(0,-1),(-1,0),(0,0)] unchanged", () => {
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(String))).toEqual(new Set(block.map(String)));
  });
});
