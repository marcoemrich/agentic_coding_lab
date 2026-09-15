import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";
import type { Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies: [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: adjacent cells [(0,1),(1,1)] each have one neighbor and become []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival with two neighbors: the center of three adjacent live cells remains alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("survival example: a live center cell with three live neighbors remains alive", () => {
    expect(nextGeneration([[0, 0], [-1, -1], [0, -1], [1, -1]])).toContainEqual([0, 0]);
  });
  it("overpopulation example: center cell (1,1) with more than three live neighbors dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction: dead cell (1,1) with exactly three neighbors becomes alive, producing a four-cell block", () => {
    expectCells(
      nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    );
  });
  it("block still life: [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("blinker generation 1: vertical [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker generation 2: the horizontal generation returns to [(0,0),(0,1),(0,2)]", () => {
    expectCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]), [[0, 0], [0, 1], [0, 2]]);
  });
});
