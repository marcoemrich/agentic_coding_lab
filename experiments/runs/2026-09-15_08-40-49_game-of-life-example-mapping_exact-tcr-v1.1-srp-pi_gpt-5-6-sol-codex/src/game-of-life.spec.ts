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
  it("kills a single cell with 0 neighbors -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills adjacent cells with 1 neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) with exactly 3 live neighbors alive", () => {
    const cells = [[1, 1], [0, 2], [1, 2], [2, 2]] as [number, number][];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("kills the center cell (1,1) with 4 live neighbors", () => {
    const cells = [[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]] as [number, number][];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly 3 neighbors -- the three-cell corner becomes a four-cell block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("oscillates the blinker across two generations, including negative coordinates -- vertical to horizontal to vertical", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const generationOne = nextGeneration(vertical);

    expectCells(generationOne, horizontal);
    expectCells(nextGeneration(generationOne), vertical);
  });
});
