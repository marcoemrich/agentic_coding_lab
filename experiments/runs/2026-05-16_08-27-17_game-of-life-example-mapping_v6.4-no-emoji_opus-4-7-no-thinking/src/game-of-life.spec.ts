import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (underpopulation: each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a block (still life) unchanged - 4 cells each with 3 neighbors survive", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("transforms vertical blinker to horizontal blinker (survival + reproduction)", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("kills a live cell with more than 3 neighbors (overpopulation)", () => {
    // Prompt's overpopulation pattern: top row, center, bottom row alive.
    //   ###
    //   .#.
    //   ###
    // Center (1,1) has 4 live neighbors -> dies (overpopulation).
    // Live cells: each corner has 2 neighbors (survives).
    // Live cells (1,0) and (1,2) each have 3 neighbors (survives).
    // Dead cells (0,1) and (2,1) each have 5 neighbors (stays dead).
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Verify (1,1) is NOT in result (overpopulation rule applied)
    expect(result).not.toContainEqual([1, 1]);
    // Verify corners survive
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([2, 0]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toContainEqual([2, 2]);
  });
  it("handles negative coordinates correctly", () => {
    // Block at negative coordinates - should remain unchanged
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
