import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life next generation", () => {
  it("returns [] when the current generation is []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent cells [(0,1),(1,1)] because each has only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps a live cell with exactly three live neighbors alive", () => {
    expect(nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]])).toContainEqual([1, 1]);
  });
  it("removes a live center cell with four live neighbors", () => {
    const next = nextGeneration([[1, 1], [1, 0], [2, 1], [1, 2], [0, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("returns the block [(0,0),(1,0),(0,1),(1,1)] when dead (1,1) has exactly three neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("transforms vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it("transforms horizontal blinker [(-1,1),(0,1),(1,1)] back into [(0,0),(0,1),(0,2)]", () => {
    expectCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]), [[0, 0], [0, 1], [0, 2]]);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
});
