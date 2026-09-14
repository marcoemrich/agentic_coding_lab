import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]) {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
}

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("returns [] for the single live cell [(0,0)]", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] when adjacent cells [(0,1),(1,1)] each have one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with two live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live cell with three live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("kills the center of the ###/.#./### overpopulation example", () => {
    const next = nextGeneration([
      [0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("births (1,0) in the [(0,1),(1,1),(0,0)] reproduction example", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    expectCells(next, [[0, 1], [1, 1], [0, 0], [1, 0]]);
  });
  it("turns the vertical blinker into [(-1,1),(0,1),(1,1)] and back", () => {
    const horizontal = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectCells(horizontal, [[-1, 1], [0, 1], [1, 1]]);
    expectCells(nextGeneration(horizontal), [[0, 0], [0, 1], [0, 2]]);
  });
  it("leaves the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
