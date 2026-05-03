import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (each has 1 neighbor) - underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("rule 2 - survival: cell with 2 or 3 neighbors lives on", () => {
    // Block - each cell has exactly 3 neighbors and survives
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });

  it("rule 3 - overpopulation: cell with > 3 neighbors dies", () => {
    // Full 3x3 block - center has 8 neighbors, dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // L-shape: (0,0), (1,0), (0,1) - dead cell (1,1) has 3 neighbors
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });

  it("blinker oscillates", () => {
    // Vertical blinker: (0,0), (0,1), (0,2) -> horizontal: (-1,1), (0,1), (1,1)
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);

    const gen2 = nextGeneration(gen1);
    expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
  });

  it("block is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("handles negative coordinates", () => {
    // Blinker centered at negative coords
    const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
  });

  it("L-shape from rule 4 example produces correct next gen", () => {
    // ##.
    // #..
    // ...
    // Cells: (0,0), (1,0), (0,1)
    // Expected next: ##. / ##. / ...
    // -> (0,0), (1,0), (0,1), (1,1)
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
