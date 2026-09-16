import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell from underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive -- output contains (0,0)", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [0, -1]])).toContainEqual([0, 0]);
  });
  it("keeps a live cell with exactly 3 live neighbors alive -- output contains (0,0)", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [0, -1], [1, 0]])).toContainEqual([0, 0]);
  });
  it("kills a live cell with 4 live neighbors from overpopulation -- output excludes (0,0)", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces a dead cell with exactly 3 live neighbors -- output contains (1,1)", () => {
    expect(nextGeneration([[0, 1], [1, 0], [0, 0]])).toContainEqual([1, 1]);
  });
  it("oscillates a blinker -- vertical becomes horizontal, then vertical again", () => {
    const horizontal = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectCells(horizontal, [[-1, 1], [0, 1], [1, 1]]);

    const vertical = nextGeneration(horizontal);
    expectCells(vertical, [[0, 0], [0, 1], [0, 2]]);
  });
  it("preserves a 2x2 block still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("handles negative input coordinates on the infinite grid -- a negative 2x2 block is unchanged", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expectCells(nextGeneration(block), block);
  });
});
