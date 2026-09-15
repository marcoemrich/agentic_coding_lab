import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell at (0,0) by underpopulation -- returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells at (0,1) and (1,1), each with one neighbor -- returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps the live center cell (1,1) with exactly three live neighbors alive", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills the live center cell (1,1) with four live neighbors by overpopulation", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces at dead cell (1,1) with exactly three neighbors -- triangle becomes a four-cell block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(next, block);
  });
  it("transforms vertical blinker [(0,0),(0,1),(0,2)] to horizontal [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expectCells(next, horizontal);
  });
  it("transforms the horizontal blinker back to the vertical blinker in generation 2", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expectCells(nextGeneration(horizontal), vertical);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
});
