import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills a single cell at (0,0) -- []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills two adjacent cells at (0,1) and (1,1) through underpopulation -- []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps the example center cell (1,1) with exactly 3 live neighbors alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills the example center cell (1,1) with 4 live neighbors", () => {
    const next = nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("births dead cell (1,1) with exactly 3 neighbors -- the resulting 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);

    expectCells(next, block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expectCells(next, horizontal);
  });
  it("returns the blinker to [(0,0),(0,1),(0,2)] after two generations", () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const secondGeneration = nextGeneration(nextGeneration(initial));

    expectCells(secondGeneration, initial);
  });
});
