import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty input — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: should kill two adjacent cells each having 1 neighbor — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell (1,0) with 3 live neighbors lives on — [(0,0),(1,0),(2,0),(1,2)] → [(0,1),(1,-1),(1,0),(2,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]))).toEqual([
      [0, 1],
      [1, -1],
      [1, 0],
      [2, 1],
    ]);
  });
  it("Rule 3 Overpopulation: center (1,1) with 4 live neighbors dies — [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] → [(0,0),(0,2),(1,-1),(1,0),(1,2),(1,3),(2,0),(2,2)]", () => {
    expect(
      sortCells(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])),
    ).toEqual([
      [0, 0],
      [0, 2],
      [1, -1],
      [1, 0],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 2],
    ]);
  });
  it("Rule 4 Reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("Block still life: should leave [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("Blinker gen 0 → gen 1: [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker gen 1 → gen 2: [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    expect(sortCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("Infinite grid with negative coordinates: block at negative coordinates is unchanged — [(-5,-5),(-4,-5),(-5,-4),(-4,-4)]", () => {
    expect(
      sortCells(nextGeneration([[-5, -5], [-4, -5], [-5, -4], [-4, -4]])),
    ).toEqual([
      [-5, -5],
      [-5, -4],
      [-4, -5],
      [-4, -4],
    ]);
  });
});
