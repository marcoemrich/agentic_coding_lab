import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("single live cell with no neighbors dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: live cells with fewer than 2 live neighbors die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell with 2 or 3 live neighbors lives on -- center (1,1) with 3 live neighbors in [(0,0),(1,0),(2,0),(1,1)] survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: live cell with more than 3 live neighbors dies -- center (1,1) with 4 live neighbors in [(0,0),(2,0),(1,1),(0,2),(2,2)] dies", () => {
    expect(
      nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]),
    ).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("Blinker: vertical line [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("Blinker: horizontal line [(-1,1),(0,1),(1,1)] becomes vertical [(0,0),(0,1),(0,2)]", () => {
    expect(sortCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual(
      sortCells([[0, 0], [0, 1], [0, 2]]),
    );
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
});
