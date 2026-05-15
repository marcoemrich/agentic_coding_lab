import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectSameCells = (actual: Cell[], expected: Cell[]) => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills a pair of live cells (underpopulation)", () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it("preserves a 2x2 block (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("oscillates a blinker (period 2)", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("kills overpopulated cell with more than three neighbors", () => {
    // Center cell at (0,0) has 4 neighbors -> dies
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(cells);
    const hasCenter = result.some(([x, y]) => x === 0 && y === 0);
    expect(hasCenter).toBe(false);
  });

  it("births a dead cell with exactly three neighbors", () => {
    // Three cells around (0,0)
    const cells: Cell[] = [[1, 0], [-1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const hasCenter = result.some(([x, y]) => x === 0 && y === 0);
    expect(hasCenter).toBe(true);
  });

  it("handles negative coordinates", () => {
    const block: Cell[] = [
      [-5, -5],
      [-4, -5],
      [-5, -4],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("handles large coordinates", () => {
    const block: Cell[] = [
      [1000000, 1000000],
      [1000001, 1000000],
      [1000000, 1000001],
      [1000001, 1000001],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("glider moves correctly after one generation", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expected);
  });

  it("does not return duplicate cells", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(cells);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
