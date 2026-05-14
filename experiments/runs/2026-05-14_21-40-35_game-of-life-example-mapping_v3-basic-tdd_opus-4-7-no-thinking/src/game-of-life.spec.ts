import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells with only 1 neighbor each (underpopulation)", () => {
    // Two horizontally adjacent cells, each has 1 neighbor → both die
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("keeps a block (still life) unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("oscillates a vertical blinker into a horizontal blinker", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1Expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1Expected));
  });

  it("oscillates the blinker back after two generations", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });

  it("handles reproduction: dead cell with exactly 3 live neighbors becomes alive", () => {
    // L-shape: (0,0), (1,0), (0,1) → (1,1) has 3 neighbors and becomes alive
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = sortCells(nextGeneration(gen0));
    const expected = sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toEqual(expected);
  });

  it("handles overpopulation: cell with 4+ neighbors dies", () => {
    // Center cell at (1,1) surrounded by all 8 neighbors of a 3x3 - this has 8 neighbors
    // Use a configuration where center has 4 neighbors
    // ###
    // .#.
    // ###
    const gen0: Cell[] = [
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    const result = nextGeneration(gen0);
    // Center (1,1) had 4 neighbors → should die
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it("handles negative coordinates", () => {
    // Blinker at negative coords
    const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(expected));
  });

  it("does not produce duplicate cells in output", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(gen0);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
