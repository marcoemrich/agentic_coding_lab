import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

function expectCells(actual: [number, number][], expected: [number, number][]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills a single live cell by underpopulation -- []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills two adjacent live cells with one neighbor each -- []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("keeps a live center cell with exactly 2 neighbors alive -- contains (1,1)", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("keeps a live center cell with exactly 3 neighbors alive -- contains (1,1)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills a live center cell with 4 neighbors by overpopulation -- excludes (1,1)", () => {
    expect(nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("births a dead center cell with exactly 3 neighbors -- contains (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("keeps the four-cell block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    expectCells(
      nextGeneration([[0, 0], [0, 1], [0, 2]]),
      [[-1, 1], [0, 1], [1, 1]],
    );
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)]", () => {
    expectCells(
      nextGeneration([[-1, 1], [0, 1], [1, 1]]),
      [[0, 0], [0, 1], [0, 2]],
    );
  });
});
