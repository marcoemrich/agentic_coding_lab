import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die (each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("block is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("blinker oscillates from vertical to horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });

  it("blinker oscillates back from horizontal to vertical", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
  });

  it("reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // Gen 0: cells (0,0), (1,0), (0,1)  -> L-shape
    // Dead cell (1,1) has exactly 3 neighbors -> becomes alive
    // (0,0) has 2 neighbors -> survives
    // (1,0) has 2 neighbors -> survives
    // (0,1) has 2 neighbors -> survives
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const gen1: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });

  it("overpopulation: center cell with 4+ neighbors dies", () => {
    // Gen 0:
    //  ###
    //  .#.
    //  ###
    // Center (1,1) has 4 live neighbors -> dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center should not be alive in next gen
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it("handles negative coordinates", () => {
    // Blinker at negative coordinates
    const vertical: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });

  it("does not produce duplicate cells in output", () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinker);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
