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
  it("kills the single cell [(0,0)] by underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills the adjacent cells [(0,1),(1,1)] with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces at dead cell (1,1) with exactly three neighbors: [(0,1),(1,0),(0,0)] becomes [(0,1),(1,0),(0,0),(1,1)]", () => {
    expectCells(nextGeneration([[0, 1], [1, 0], [0, 0]]), [[0, 1], [1, 0], [0, 0], [1, 1]]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged because each cell has three neighbors", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expectCells(nextGeneration(block), block);
  });
  it("turns blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns the horizontal blinker [(-1,1),(0,1),(1,1)] back into [(0,0),(0,1),(0,2)]", () => {
    expectCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]), [[0, 0], [0, 1], [0, 2]]);
  });
  it("kills overpopulated center (1,1) in the supplied pattern and applies all rules on the infinite grid", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const expected: Cell[] = [[1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3]];
    expectCells(nextGeneration(cells), expected);
  });
  it("handles an infinite sparse grid at negative coordinates: [(-2,-2),(-2,-1),(-2,0)] becomes [(-3,-1),(-2,-1),(-1,-1)]", () => {
    expectCells(nextGeneration([[-2, -2], [-2, -1], [-2, 0]]), [[-3, -1], [-2, -1], [-1, -1]]);
  });
});
