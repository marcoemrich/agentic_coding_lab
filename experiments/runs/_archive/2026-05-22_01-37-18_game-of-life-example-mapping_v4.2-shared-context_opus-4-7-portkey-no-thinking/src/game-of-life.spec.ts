import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell dies (0 neighbours) - [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die (1 neighbour each) - [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("block is a still life - [(0,0),(1,0),(0,1),(1,1)] unchanged (each live cell has 3 neighbours, no dead cell has 3)", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("dead cell with exactly 3 live neighbours is born (Rule 4 L-shape) - [(0,2),(1,2),(0,1)] -> [(0,2),(1,2),(0,1),(1,1)]", () => {
    const input: Cell[] = [
      [0, 2],
      [1, 2],
      [0, 1],
    ];
    const expected: Cell[] = [
      [0, 2],
      [1, 2],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });

  it("live cell with 4 neighbours dies, corners born (Rule 3 + shape) - [(1,2),(0,1),(1,1),(2,1),(1,0)] -> [(1,2),(0,1),(2,1),(1,0),(0,0),(2,0),(0,2),(2,2)]", () => {
    const input: Cell[] = [
      [1, 2],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 0],
    ];
    const expected: Cell[] = [
      [1, 2],
      [0, 1],
      [2, 1],
      [1, 0],
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });

  it("blinker oscillates vertical to horizontal (Rules 1+2+4, negative x) - [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });

  it("handles negative y (horizontal blinker on y=0) - [(-1,0),(0,0),(1,0)] -> [(0,-1),(0,0),(0,1)]", () => {
    const input: Cell[] = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    const expected: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });

  it("works on a sparse infinite grid (block far from origin) - [(100,100),(101,100),(100,101),(101,101)] unchanged", () => {
    const block: Cell[] = [
      [100, 100],
      [101, 100],
      [100, 101],
      [101, 101],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
