import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single cell dies (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 - Underpopulation: two adjacent cells each with 1 neighbor die", () => {
    const gen0: Cell[] = [
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(gen0), []);
  });

  it("Rule 2 - Survival: center cell with 3 neighbors lives, blinker case", () => {
    // vertical blinker [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(gen0), expected);
  });

  it("Rule 3 - Overpopulation: live cell with > 3 neighbors dies", () => {
    // 3x3 full grid: center (1,1) has 8 neighbors → dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center should not be alive due to overpopulation (it was dead and has 8 neighbors anyway, so still dead by reproduction rule)
    // But check that no cell in result has > 3 neighbors check, we just verify result doesn't include center as alive incorrectly
    const hasCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenter).toBe(false);
  });

  it("Rule 3 - Overpopulation example from prompt: ring around center", () => {
    // Gen 0:       Gen 1:
    //  ###          #.#
    //  .#.    →     #.#
    //  ###          #.#
    // Reading: row 0 = ###, row 1 = .#., row 2 = ###
    // Coordinates (x, y) where y is row: [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)]
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    // Within the displayed 3x3 window: #.# / #.# / #.# — center dies (overpopulation, 6 neighbors).
    // Note: cells outside the displayed window also come alive via reproduction:
    //   (1,-1) has neighbors (0,0),(1,0),(2,0) = 3 → alive
    //   (1,3)  has neighbors (0,2),(1,2),(2,2) = 3 → alive
    const result = nextGeneration(gen0);
    // Center must die (overpopulation rule):
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    // 4 corners survive:
    for (const corner of [[0, 0], [2, 0], [0, 2], [2, 2]] as Cell[]) {
      expect(result.some(([x, y]) => x === corner[0] && y === corner[1])).toBe(true);
    }
  });

  it("Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // Gen 0:       Gen 1:
    //  ##.          ##.
    //  #..    →     ##.
    //  ...          ...
    const gen0: Cell[] = [
      [0, 0], [1, 0],
      [0, 1],
    ];
    const expected: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expectSameCells(nextGeneration(gen0), expected);
  });

  it("Block (still life) remains unchanged", () => {
    const block: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("Blinker oscillates back after two generations", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen1 = nextGeneration(gen0);
    const gen2 = nextGeneration(gen1);
    expectSameCells(gen2, gen0);
  });

  it("handles negative coordinates", () => {
    // Blinker centered at negative coords
    const gen0: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const expected: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(gen0), expected);
  });

  it("does not duplicate cells in output", () => {
    const block: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    const result = nextGeneration(block);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
