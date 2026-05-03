import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

describe("Game of Life - nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Rule 1 - underpopulation: single cell dies", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 - underpopulation: two adjacent cells die", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("Rule 2 - survival: cell with 2 neighbors stays alive (block still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("Rule 3 - overpopulation: center cell with 4+ neighbors dies", () => {
    // ###
    // .#.
    // ###
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(cells);
    // Center (1,1) had 4 neighbors -> dies
    expect(next).not.toContainEqual([1, 1]);
  });

  it("Rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // ##.
    // #..
    // ...
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    // Dead cell (1,1) had 3 neighbors -> alive
    expect(next).toContainEqual([1, 1]);
  });

  it("Blinker: vertical becomes horizontal", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });

  it("Blinker oscillates back after 2 generations", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });

  it("Block is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(blinker))).toEqual(sortCells(expected));
  });

  it("does not duplicate cells in output", () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration(blinker);
    const set = new Set(next.map(([x, y]) => `${x},${y}`));
    expect(set.size).toBe(next.length);
  });
});
