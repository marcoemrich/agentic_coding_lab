import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("keeps a block (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("transforms a vertical blinker to horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });

  it("blinker oscillates back to vertical after two generations", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(vertical));
    expect(sortCells(gen2)).toEqual(sortCells(vertical));
  });

  it("handles overpopulation - center cell with 4 neighbors dies", () => {
    // 3x3 filled grid; center (1,1) has 8 neighbors so dies; corners survive
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // Pattern from prompt rule 4: ##. / #.. / ...
    // Coords: (0,0), (1,0), (0,1) -> next gen should include (1,1)
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });

  it("handles negative coordinates", () => {
    const cells: Cell[] = [[-1, -1], [-1, 0], [-1, 1]]; // vertical blinker at x=-1
    const expected: Cell[] = [[-2, 0], [-1, 0], [0, 0]];
    expect(sortCells(nextGeneration(cells))).toEqual(sortCells(expected));
  });

  it("does not return duplicate cells", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(cells);
    const set = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(set.size).toBe(result.length);
  });
});
