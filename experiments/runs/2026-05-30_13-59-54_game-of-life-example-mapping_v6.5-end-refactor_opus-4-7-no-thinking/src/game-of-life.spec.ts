import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block (still life) stays the same — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("live cell with 4 neighbors dies (overpopulation) — center of full 3x3 dies", () => {
    const full3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(full3x3)).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — (1,1) born from L-shape", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    expect(nextGeneration(lShape)).toContainEqual([1, 1]);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("rule 2 survival: live cell with 2 live neighbors survives — center of L-shape lives on", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    expect(nextGeneration(lShape)).toContainEqual([0, 0]);
  });
  it("rule 3 example: full 3x3 evolves — 4 corners survive, 4 mid-edges born, center dies", () => {
    const full3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 0], [2, 0], [0, 2], [2, 2],
      [-1, 1], [1, -1], [3, 1], [1, 3],
    ];
    expect(sortCells(nextGeneration(full3x3))).toEqual(sortCells(expected));
  });
  it("rule 4 example: L-shape (3 cells) evolves to 2x2 block — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(lShape))).toEqual(sortCells(block));
  });
  it("handles negative coordinates — block at negative coords stays unchanged", () => {
    const negBlock: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expect(sortCells(nextGeneration(negBlock))).toEqual(sortCells(negBlock));
  });
});
