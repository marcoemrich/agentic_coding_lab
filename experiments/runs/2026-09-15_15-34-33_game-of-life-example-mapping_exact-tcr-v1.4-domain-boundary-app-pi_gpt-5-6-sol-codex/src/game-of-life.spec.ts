import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
}

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the single cell [(0,0)] by underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both adjacent cells [(0,1),(1,1)] with one neighbor, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell (1,1) with exactly 3 live neighbors alive", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills a live center cell (1,1) with more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [0, 1], [1, 0], [2, 1]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces at dead cell (1,1) with exactly 3 neighbors, producing [(0,0),(0,1),(1,0),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [1, 0]]), [
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("oscillates the blinker from [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)] and back", () => {
    const generationOne = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(generationOne, [[-1, 1], [0, 1], [1, 1]]);
    expectCells(nextGeneration(generationOne), [[0, 0], [0, 1], [0, 2]]);
  });
});
