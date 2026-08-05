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
  it("Rule 2 Survival: center cell with 3 live neighbors survives -- [(0,0),(1,0),(2,0),(1,1)] -> includes (1,1)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: center cell with 4+ live neighbors dies -- 3x3 ring plus center -> center (1,1) not alive", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> includes (1,1)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect([...result].sort()).toEqual([...block].sort());
  });
  it("Blinker oscillates vertical -> horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result.sort()).toEqual(
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ].sort(),
    );
  });
  it("Blinker returns to vertical after two generations -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(result.sort()).toEqual(
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ].sort(),
    );
  });
  it("should handle negative coordinates -- blinker at negative coords oscillates", () => {
    const result = nextGeneration([
      [-5, -10],
      [-5, -9],
      [-5, -8],
    ]);
    expect(result.sort()).toEqual(
      [
        [-6, -9],
        [-5, -9],
        [-4, -9],
      ].sort(),
    );
  });
});
