import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const expectCellsEqual = (actual: Cell[], expected: Cell[]) => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("nextGeneration", () => {
  it("empty input returns empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single cell dies of underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent cells both die of underpopulation", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("a block (still life) remains stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCellsEqual(nextGeneration(block), block);
  });

  it("a blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectCellsEqual(nextGeneration(horizontal), vertical);
    expectCellsEqual(nextGeneration(vertical), horizontal);
  });

  it("a living cell with 4+ neighbors dies of overpopulation", () => {
    // Center cell at (0,0) with 4 neighbors
    const cells: Cell[] = [
      [0, 0],
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];
    const next = nextGeneration(cells);
    // (0,0) has 4 live neighbors, dies
    expect(next.find(([x, y]) => x === 0 && y === 0)).toBeUndefined();
  });

  it("a dead cell with exactly 3 live neighbors becomes alive", () => {
    // Three cells around (1,1) where (1,1) is dead
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(next.find(([x, y]) => x === 1 && y === 1)).toBeDefined();
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-5, -5], [-4, -5], [-3, -5]];
    const expected: Cell[] = [[-4, -6], [-4, -5], [-4, -4]];
    expectCellsEqual(nextGeneration(blinker), expected);
  });

  it("glider moves correctly after one generation", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1], [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expectCellsEqual(nextGeneration(glider), expected);
  });

  it("does not mutate the input", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const copy: Cell[] = input.map(([x, y]) => [x, y]);
    nextGeneration(input);
    expect(input).toEqual(copy);
  });

  it("returns each living cell only once (no duplicates)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
