import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(new Set(actual.map(cell => JSON.stringify(cell)))).toEqual(new Set(expected.map(cell => JSON.stringify(cell))));
  expect(actual).toHaveLength(expected.length);
}

describe("nextGeneration", () => {
  it("empty generation [] stays []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("single live cell [(0,0)] dies to [] with zero neighbors", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("adjacent pair [(0,1),(1,1)] dies to [] with one neighbor each", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("live cell with two neighbors survives at (0,0)", () => {
    expectCells(nextGeneration([[-1, 0], [0, 0], [1, 0]]), [[0, -1], [0, 0], [0, 1]]);
  });
  it("live center (1,1) with three neighbors survives", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("dead cell with two neighbors remains dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it("dead center (1,1) with three neighbors is born from [(0,0),(1,0),(0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("dead cell with four neighbors remains dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker returns to [(0,0),(0,1),(0,2)] in two generations", () => {
    expectCells(nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]])), [[0, 0], [0, 1], [0, 2]]);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("negative-coordinate block [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] stays unchanged", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expectCells(nextGeneration(block), block);
  });
  it("distant cells do not interact across the infinite sparse grid", () => {
    const blocks: Cell[] = [
      [0, 0], [1, 0], [0, 1], [1, 1],
      [1000000, -1000000], [1000001, -1000000],
      [1000000, -999999], [1000001, -999999],
    ];
    expectCells(nextGeneration(blocks), blocks);
  });
});
