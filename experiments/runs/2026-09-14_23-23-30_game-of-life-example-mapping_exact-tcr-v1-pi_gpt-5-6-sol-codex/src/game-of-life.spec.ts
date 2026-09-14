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
  it("kills the single cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells at (0,1) and (1,1) with one neighbor, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two neighbors alive", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps a live cell with exactly three neighbors alive", () => {
    const next = nextGeneration([[0, 0], [-1, 1], [0, 1], [1, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("kills a live cell with four neighbors (the rule text is authoritative over the inconsistent Rule 3 diagram)", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces at dead cell (1,1) with three neighbors, producing the 2x2 block [(0,1),(1,1),(0,0),(1,0)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("evolves vertical blinker [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(next, [[-1, 1], [0, 1], [1, 1]]);
  });
  it("evolves horizontal blinker [(-1,1),(0,1),(1,1)] back to [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expectCells(next, [[0, 0], [0, 1], [0, 2]]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("keeps a block translated into negative x and y coordinates unchanged", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];

    expectCells(nextGeneration(block), block);
  });
});
