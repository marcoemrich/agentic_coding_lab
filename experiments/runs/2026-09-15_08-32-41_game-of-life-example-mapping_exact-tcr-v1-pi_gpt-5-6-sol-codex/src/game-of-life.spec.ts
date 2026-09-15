import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("underpopulation: a single cell at (0,0) dies, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation example: adjacent cells (0,1) and (1,1) each have one neighbor and both die, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: a live cell with exactly 2 neighbors remains alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 0]);
  });
  it("survival example: the center cell (1,1) with exactly 3 neighbors remains alive", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("overpopulation example: the center cell (1,1) with more than 3 neighbors dies", () => {
    const next = nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction example: dead cell (1,1) with exactly 3 neighbors is born, producing the 2x2 block [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("block still life remains [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("blinker transforms from [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(next, [[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker returns to [(0,0),(0,1),(0,2)] after two generations", () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expectCells(nextGeneration(nextGeneration(initial)), initial);
  });
  it("handles an oscillator at negative x and y coordinates on the infinite grid", () => {
    const next = nextGeneration([[-2, -3], [-2, -2], [-2, -1]]);

    expectCells(next, [[-3, -2], [-2, -2], [-1, -2]]);
  });
});
