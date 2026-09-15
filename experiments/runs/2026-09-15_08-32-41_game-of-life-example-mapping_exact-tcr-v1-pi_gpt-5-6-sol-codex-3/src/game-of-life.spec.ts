import { describe, expect, it } from "vitest";

import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the lone cell [(0,0)] by underpopulation, returning []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells [(0,1),(1,1)] with one neighbor each, returning []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces at dead cell (1,1) with exactly three neighbors: [(0,0),(0,1),(1,0)] becomes [(0,0),(0,1),(1,0),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [1, 0]]), [
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("keeps a live cell with two neighbors alive: [(0,0),(1,0),(2,0)] becomes [(1,-1),(1,0),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [2, 0]]), [
      [1, -1], [1, 0], [1, 1],
    ]);
  });
  it("keeps a live cell with three neighbors alive: [(0,0),(1,0),(2,0),(1,1)] includes surviving (1,0) in the next generation", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("kills a live cell with exactly four neighbors by overpopulation", () => {
    const next = nextGeneration([[0, 0], [0, -1], [1, 0], [0, 1], [-1, 0]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("applies the infinite-grid rules to the depicted overpopulation input, including births beyond the diagram", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]), [
      [0, 0], [2, 0], [1, -1], [1, 0], [1, 2], [1, 3], [0, 2], [2, 2],
    ]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("turns blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], handling negative coordinates", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the horizontal blinker [(-1,1),(0,1),(1,1)] back into [(0,0),(0,1),(0,2)] on generation two", () => {
    expectCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]), [
      [0, 0], [0, 1], [0, 2],
    ]);
  });
});
