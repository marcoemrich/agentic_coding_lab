import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("single cell dies — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation — two adjacent cells [(0,1),(1,1)] each have 1 neighbor and both die → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 reproduction — [(0,0),(1,0),(0,1)] L-shape: dead cell (1,1) has 3 neighbors becomes alive → [(0,0),(1,0),(0,1),(1,1)] (block)", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });
  it("Block still life — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillator — vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("Blinker oscillator — horizontal [(-1,1),(0,1),(1,1)] becomes vertical [(0,0),(0,1),(0,2)]", () => {
    expect(sortCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual(
      sortCells([[0, 0], [0, 1], [0, 2]])
    );
  });
});
