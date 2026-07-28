import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - nextGeneration", () => {
  it("single cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: live cells with fewer than 2 live neighbors die -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 survival: live cell with 3 live neighbors lives on -- center (1,1) of [(0,0),(1,0),(2,0),(1,1)] survives", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(next).toContainEqual([1, 1]);
  });
  it("Rule 3 overpopulation: live cell with more than 3 live neighbors dies -- center (1,1) of 7-cell pattern dies", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(sortCells(next)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("block is a still life -- [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("blinker oscillates from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(sortCells(next)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("blinker returns to original after two generations -- [(0,0),(0,1),(0,2)] -> Gen 2 [(0,0),(0,1),(0,2)]", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });
});
