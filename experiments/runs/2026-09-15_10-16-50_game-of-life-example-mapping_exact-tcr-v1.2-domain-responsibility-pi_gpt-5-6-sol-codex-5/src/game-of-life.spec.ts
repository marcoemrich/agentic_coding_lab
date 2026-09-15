import { describe, expect, it } from "vitest";

import { nextGeneration, type Cell } from "./game-of-life.js";

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toEqual(expect.arrayContaining(expected));
  expect(actual).toHaveLength(expected.length);
}

describe("Game of Life - next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a lone live cell with 0 neighbors -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills live cells with 1 neighbor -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with 2 neighbors alive -- (1,1) remains alive", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("keeps a live cell with 3 neighbors alive -- (1,1) remains alive", () => {
    const cells = [[0, 0], [1, 0], [2, 0], [1, 1]] as Cell[];
    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("kills a live cell with 4 neighbors -- (1,1) is absent", () => {
    const cells = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]] as Cell[];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly 3 neighbors -- the L shape becomes a 2x2 block", () => {
    const cells = [[0, 0], [1, 0], [0, 1]] as Cell[];
    expectSameCells(nextGeneration(cells), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the 2x2 block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as Cell[];
    expectSameCells(nextGeneration(block), block);
  });
  it("rotates a vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as Cell[];
    const horizontal = [[-1, 1], [0, 1], [1, 1]] as Cell[];
    expectSameCells(nextGeneration(vertical), horizontal);
  });
  it("rotates the horizontal blinker back into [(0,0),(0,1),(0,2)]", () => {
    const horizontal = [[-1, 1], [0, 1], [1, 1]] as Cell[];
    const vertical = [[0, 0], [0, 1], [0, 2]] as Cell[];
    expectSameCells(nextGeneration(horizontal), vertical);
  });
  it("handles negative coordinates on the infinite grid -- a blinker centered at x=-2 rotates around x=-2", () => {
    const vertical = [[-2, 0], [-2, 1], [-2, 2]] as Cell[];
    const horizontal = [[-3, 1], [-2, 1], [-1, 1]] as Cell[];
    expectSameCells(nextGeneration(vertical), horizontal);
  });
});
