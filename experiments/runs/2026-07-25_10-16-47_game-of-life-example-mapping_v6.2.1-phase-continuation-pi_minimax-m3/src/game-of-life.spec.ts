import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- input [] -> output []", () => {
    expect(sortCells(nextGeneration([]))).toEqual(sortCells([]));
  });

  it("should kill a single live cell (Rule 1: underpopulation) -- input [(0,0)] -> output []", () => {
    expect(sortCells(nextGeneration([[0, 0]]))).toEqual(sortCells([]));
  });

  it("should kill two adjacent live cells, each with 1 neighbor (Rule 1 spec example) -- input [(0,1),(1,1)] -> output []", () => {
    expect(sortCells(nextGeneration([[0, 1], [1, 1]]))).toEqual(sortCells([]));
  });

  it("should keep a horizontal 3-cell line where middle survives and new cells are born above and below (Rule 2 + Rule 4: real GoL blinker rotation) -- input [(0,0),(1,0),(2,0)] -> output [(1,-1),(1,0),(1,1)]", () => {
    expect(
      sortCells(nextGeneration([[0, 0], [1, 0], [2, 0]])),
    ).toEqual(sortCells([[1, -1], [1, 0], [1, 1]]));
  });

  it("should keep a Block still life unchanged (Rule 2: 4 cells in 2x2 each with 3 neighbors) -- input [(0,0),(1,0),(0,1),(1,1)] -> output [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      sortCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])),
    ).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("should kill overpopulated center of a 3x3-with-center pattern (Rule 3) -- input 7-cell pattern -> output top+bottom rows plus births at (1,-1) and (1,3)", () => {
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const expected: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, -1],
      [1, 3],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });

  it("should reproduce a dead cell with exactly 3 neighbors (Rule 4 spec example) -- input 3-corner L-shape -> output 4-cell 2x2 block", () => {
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const expected: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });

  it("should oscillate a Blinker between vertical and horizontal orientations (spec pattern) -- Gen 0 vertical -> Gen 1 horizontal -> Gen 2 vertical", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen1: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const gen2: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
    expect(sortCells(nextGeneration(gen1))).toEqual(sortCells(gen2));
  });

  it("should handle negative coordinates on an infinite grid -- Block at negative x and y stays unchanged", () => {
    const input: Cell[] = [
      [-1, -1],
      [0, -1],
      [-1, 0],
      [0, 0],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(input));
  });

  it("should oscillate a Blinker at negative coordinates -- vertical at x=-2 -> horizontal at y=-3", () => {
    const vertical: Cell[] = [
      [-2, -4],
      [-2, -3],
      [-2, -2],
    ];
    const horizontal: Cell[] = [
      [-3, -3],
      [-2, -3],
      [-1, -3],
    ];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
