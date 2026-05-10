import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const expectCells = (actual: number[][], expected: number[][]) => {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
};

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid when single cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid when two adjacent cells die from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring dead cell to life when it has exactly 3 live neighbors", () => {
    // (0,0),(1,0),(0,1) each have 2 neighbors → survive; dead (1,1) has 3 neighbors → born
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should keep live cell alive when it has exactly 2 live neighbors", () => {
    // Block: each cell has exactly 2 live neighbors → all survive, no new births
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should oscillate blinker pattern from vertical to horizontal", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
});
