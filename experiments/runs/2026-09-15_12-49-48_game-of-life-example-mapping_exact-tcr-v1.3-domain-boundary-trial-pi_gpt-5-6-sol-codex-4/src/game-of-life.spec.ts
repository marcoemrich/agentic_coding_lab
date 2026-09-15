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
  it("kills a single cell with 0 neighbors, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with 1 neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 neighbors alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 0]);
  });
  it("keeps the example's center live cell with exactly 3 neighbors alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills the example's center live cell with exactly 4 neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces the example's dead cell (1,1) with exactly 3 neighbors, producing a 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the 2x2 block unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("turns the vertical blinker into [(-1,1), (0,1), (1,1)], including a negative coordinate", () => {
    expectCells(
      nextGeneration([[0, 0], [0, 1], [0, 2]]),
      [[-1, 1], [0, 1], [1, 1]],
    );
  });
  it("turns the blinker back to [(0,0), (0,1), (0,2)] after two generations", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(nextGeneration(first), [[0, 0], [0, 1], [0, 2]]);
  });
});
