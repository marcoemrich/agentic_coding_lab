import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty grid produces empty grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation, 0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1: two adjacent live cells both die (underpopulation, 1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4: dead cell with exactly 3 live neighbors becomes alive -- L-shape produces block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("Rule 2: live cell with 2 neighbors survives -- middle of 3-in-a-row stays alive", () => {
    // Row: (0,0),(1,0),(2,0). (1,0) has 2 live neighbors -> survives.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3: live cell with more than 3 neighbors dies (overpopulation) -- center of donut config dies", () => {
    // Donut: full 3x3 with center alive too. Center (1,1) has 8 neighbors -> dies.
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillator vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("Blinker oscillator horizontal back to vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
  });
  it("handles negative coordinates correctly -- blinker centered at negative origin", () => {
    // Vertical blinker shifted into negative space: x = -10, y = -5, -4, -3
    const vertical: Cell[] = [[-10, -5], [-10, -4], [-10, -3]];
    const horizontal: Cell[] = [[-11, -4], [-10, -4], [-9, -4]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
