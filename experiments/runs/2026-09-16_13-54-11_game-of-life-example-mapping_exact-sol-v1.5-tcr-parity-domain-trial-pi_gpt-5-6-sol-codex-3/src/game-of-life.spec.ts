import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single-cell example [(0,0)]", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for the underpopulation example [(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps the example target cell (1,1) alive with exactly 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("removes the example target cell (1,1) with more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("adds dead cell (1,1) with exactly 3 live neighbors in the reproduction example", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("transforms vertical blinker [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)]", () => {
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), expected);
  });
  it("transforms the horizontal blinker back to [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(horizontal), [[0, 0], [0, 1], [0, 2]]);
  });
  it("evolves a blinker across negative x and y coordinates on the infinite grid", () => {
    const vertical: Cell[] = [[-2, -2], [-2, -1], [-2, 0]];
    expectCells(nextGeneration(vertical), [[-3, -1], [-2, -1], [-1, -1]]);
  });
});
