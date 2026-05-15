import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const expectSameCells = (actual: Cell[], expected: Cell[]) => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills isolated living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills a pair of cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("preserves a block (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("oscillates a blinker (horizontal -> vertical)", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("kills a living cell with more than three neighbors (overpopulation)", () => {
    // Center cell at (0,0) has 4 neighbors: it dies.
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("0,0")).toBe(false);
  });

  it("births a dead cell with exactly three neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — (1,1) has exactly 3 neighbors and should be born.
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(true);
  });

  it("handles negative coordinates correctly", () => {
    const blinker: Cell[] = [[-5, -5], [-4, -5], [-3, -5]];
    const expected: Cell[] = [[-4, -6], [-4, -5], [-4, -4]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("evolves a glider correctly", () => {
    // Classic glider at generation 0
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    // Generation 1 of glider
    const gen1: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), gen1);
  });

  it("does not duplicate output cells", () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(blinker);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("toad oscillator (period 2)", () => {
    const toad: Cell[] = [
      [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1],
    ];
    const next = nextGeneration(toad);
    const nextNext = nextGeneration(next);
    expectSameCells(nextNext, toad);
  });
});
