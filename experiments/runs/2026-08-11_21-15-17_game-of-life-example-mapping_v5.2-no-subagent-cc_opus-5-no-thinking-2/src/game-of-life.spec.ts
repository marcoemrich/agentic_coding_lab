import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Sorts cells so assertions compare sets of cells, not incidental ordering. */
function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Single cell dies: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: each cell has 1 neighbor and dies — [(0,1),(1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: a live cell with 3 live neighbors lives on — (1,1) is in the next generation of [(0,0),(1,0),(2,0),(1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("Rule 2 Survival: a live cell with 2 live neighbors lives on — (0,1) is in the next generation of [(0,0),(0,1),(0,2)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    ).toContainEqual([0, 1]);
  });
  it("Rule 3 Overpopulation: a live cell with 4 live neighbors dies — (1,1) is not in the next generation of [(0,0),(1,0),(2,0),(1,1),(1,2)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [1, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — (1,1) is in the next generation of [(0,0),(1,0),(0,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → the same 4 cells", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(sortCells(result)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("Blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(sortCells(result)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker oscillates back horizontal → vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(sortCells(result)).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("handles negative coordinates on the infinite grid — [(-11,-10),(-10,-10),(-11,-9),(-10,-9)] block is unchanged", () => {
    const result = nextGeneration([
      [-11, -10],
      [-10, -10],
      [-11, -9],
      [-10, -9],
    ]);
    expect(sortCells(result)).toEqual([
      [-11, -10],
      [-11, -9],
      [-10, -10],
      [-10, -9],
    ]);
  });
});
