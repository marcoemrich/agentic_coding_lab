import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty grid produces empty next generation — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 (single cell dies of underpopulation): [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation, two adjacent cells each with 1 neighbor both die): [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 (overpopulation, center cell with 4 neighbors dies): center of '###/.#./###' is not alive next gen", () => {
    const cells: Cell[] = [
      [0, 2], [1, 2], [2, 2],
              [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    const next = nextGeneration(cells);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("Rule 4 (reproduction, dead cell with exactly 3 neighbors becomes alive): '##./#../...' -> '##./##./...'", () => {
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const gen1: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });
  it("Rule 2 (survival, live cell with 2 neighbors stays alive): top cell of '###' survives at (1,2)", () => {
    const gen0: Cell[] = [[0, 2], [1, 2], [2, 2]];
    const next = nextGeneration(gen0);
    expect(next.some(([x, y]) => x === 1 && y === 2)).toBe(true);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillator vertical to horizontal: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("Handles negative coordinates: blinker centered at origin oscillates symmetrically", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
