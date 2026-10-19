import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const nextSorted = (cells: Cell[]): Cell[] => sortCells(nextGeneration(cells));

describe("Game of Life - Next Generation", () => {
  it("should return [] for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - two live cells each with 1 neighbor die (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 - dead cell with exactly 3 neighbors becomes alive (reproduction) -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextSorted([[0, 0], [1, 0], [0, 1]])).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("Rule 2 - survival: input ###/.../.#. from spec, correct next generation is [(0,1),(1,2),(1,3),(2,1)] (middle of ### survives with 2 neighbors)", () => {
    expect(nextSorted([[0, 2], [1, 2], [2, 2], [1, 0]])).toEqual(sortCells([[0, 1], [1, 2], [1, 3], [2, 1]]));
  });
  it("Rule 2/3 - block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    expect(nextSorted([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("Blinker Gen0 vertical -> Gen1 horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextSorted([[0, 0], [0, 1], [0, 2]])).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("Blinker Gen1 -> Gen2 (oscillator round-trip) -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    expect(nextSorted([[-1, 1], [0, 1], [1, 1]])).toEqual(sortCells([[0, 0], [0, 1], [0, 2]]));
  });
  it("Rule 3 - live cell with 4 neighbors dies (overpopulation) -- cross -> 3x3 ring with center removed: [(0,0),(0,1),(0,2),(1,0),(1,2),(2,0),(2,1),(2,2)]", () => {
    expect(nextSorted([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]])).toEqual(sortCells([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]));
  });
  it("should handle negative input coordinates -- blinker at x=-2: [(-2,0),(-2,1),(-2,2)] -> [(-3,1),(-2,1),(-1,1)]", () => {
    expect(nextSorted([[-2, 0], [-2, 1], [-2, 2]])).toEqual(sortCells([[-3, 1], [-2, 1], [-1, 1]]));
  });
});