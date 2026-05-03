import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].map(([x, y]) => [x, y] as Cell).sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectSameCells = (actual: Cell[], expected: Cell[]) => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("Conway's Game of Life - nextGeneration", () => {
  it("returns no living cells when given an empty set", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone cell from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills a cell with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("keeps living cells with two neighbors alive (block - still life)", () => {
    const block: Cell[] = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("kills cells with more than three neighbors (overpopulation)", () => {
    // Center cell at (0,0) has 4 neighbors => should die.
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    expect(result.find(([x, y]) => x === 0 && y === 0)).toBeUndefined();
  });

  it("brings a dead cell with exactly three neighbors back to life (reproduction)", () => {
    // L-shape produces a new cell at (1,1)
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    expect(result.find(([x, y]) => x === 1 && y === 1)).toBeDefined();
  });

  it("oscillates a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    const horizontal: Cell[] = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    expectSameCells(nextGeneration(vertical), horizontal);
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("handles negative coordinates", () => {
    const block: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-4, -5],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("evolves a glider correctly by one step", () => {
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

  it("does not depend on input ordering", () => {
    const block: Cell[] = [
      [1, 1],
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    expectSameCells(nextGeneration(block), [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
});
