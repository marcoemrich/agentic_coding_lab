import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectLivingCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life - next generation", () => {
  it("keeps an empty sparse grid empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) with exactly 3 live neighbors alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills the center cell (1,1) with more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly 3 neighbors -- [(0,1),(1,1),(0,0)] becomes the 2x2 block", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    expectLivingCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectLivingCells(nextGeneration(block), block);
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectLivingCells(next, [[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns the blinker back to [(0,0),(0,1),(0,2)] after two generations", () => {
    const secondGeneration = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expectLivingCells(secondGeneration, [[0, 0], [0, 1], [0, 2]]);
  });
});
