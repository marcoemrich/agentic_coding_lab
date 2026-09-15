import { describe, expect, it } from "vitest";

import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life - Next Generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at [(0,0)], producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells [(0,1),(1,1)] with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps a live cell with exactly three live neighbors alive", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("reproduces dead cell (1,0) with exactly three neighbors, completing a block", () => {
    expectCells(nextGeneration([[0, 1], [1, 1], [0, 0]]), [
      [0, 1], [1, 1], [0, 0], [1, 0],
    ]);
  });
  it("kills the overpopulated center (1,1) of the illustrated seven-cell state", () => {
    const next = nextGeneration([
      [0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0],
    ]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];

    expectCells(nextGeneration(block), block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the horizontal blinker back into the original vertical blinker on the second generation", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(nextGeneration(first), [[0, 0], [0, 1], [0, 2]]);
  });
  it("handles a pattern translated into negative x and y coordinates", () => {
    expectCells(nextGeneration([[-5, -4], [-5, -3], [-5, -2]]), [
      [-6, -3], [-5, -3], [-4, -3],
    ]);
  });
});
