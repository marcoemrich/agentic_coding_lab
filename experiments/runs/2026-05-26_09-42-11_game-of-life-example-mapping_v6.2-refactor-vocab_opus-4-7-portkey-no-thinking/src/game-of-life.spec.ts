import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty input produces empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("live cell with more than 3 neighbors dies from overpopulation", () => {
    // Gen 0: ### / .#. / ### — center (1,1) has 6 live neighbors → must die
    const gen0: Cell[] = [
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    // Center (1,1) must NOT appear in Gen 1
    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction example)", () => {
    // Gen 0: ##. / #.. / ...  → Gen 1: ##. / ##. / ...
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const gen1: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });
  it("blinker oscillates: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("blinker oscillates back: horizontal [(-1,1),(0,1),(1,1)] → vertical [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
  });
  it("handles negative coordinates correctly (blinker centered at negative position)", () => {
    const vertical: Cell[] = [[-5, -6], [-5, -5], [-5, -4]];
    const horizontal: Cell[] = [[-6, -5], [-5, -5], [-4, -5]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
