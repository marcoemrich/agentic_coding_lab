import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  const sortCells = (cells: Cell[]) =>
    [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  it("empty input returns empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("block still life is unchanged (each live cell has 3 neighbors and survives) -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(0,1),(1,0),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("single live cell with 0 neighbors dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each with 1 neighbor die (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(sortCells(nextGeneration([[0, 1], [1, 1]]))).toEqual(sortCells([]));
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) -- [(0,0),(1,0),(0,1)] -> [(0,0),(0,1),(1,0),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("live cell with more than 3 neighbors dies (overpopulation) -- [(0,0),(1,0),(0,1),(1,1),(0,2),(1,2)] -> [(-1,1),(0,0),(0,2),(1,0),(1,2),(2,1)]", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]];
    const expected: Cell[] = [[-1, 1], [0, 0], [0, 2], [1, 0], [1, 2], [2, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("blinker oscillator: vertical line becomes horizontal (middle survives with 2, ends die, two dead cells with 3 are born) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("blinker returns to original after two generations -- [(0,0),(0,1),(0,2)] -> [(0,0),(0,1),(0,2)]", () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(nextGeneration(blinker)))).toEqual(sortCells(blinker));
  });
  it("handles negative coordinates: block at negative coords unchanged -- [(-1,-1),(0,-1),(-1,0),(0,0)] -> [(-1,-1),(-1,0),(0,-1),(0,0)]", () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
