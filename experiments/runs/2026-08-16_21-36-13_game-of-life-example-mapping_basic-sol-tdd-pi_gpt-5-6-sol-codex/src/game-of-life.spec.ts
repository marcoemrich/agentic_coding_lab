import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell by underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two neighbors alive -- contains [0, 0]", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live cell with exactly three neighbors alive -- contains [0, 0]", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("kills a live cell with four neighbors by overpopulation -- excludes [0, 0]", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });
  it("creates a dead cell with exactly three neighbors -- [[0,0],[0,1],[1,0],[1,1]]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]])))
      .toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("turns a vertical blinker horizontal after one generation -- [[-1,1],[0,1],[1,1]]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]])))
      .toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("returns a blinker to vertical after two generations -- [[0,0],[0,1],[0,2]]", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(nextGeneration(first))).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("keeps a block still life unchanged -- [[0,0],[0,1],[1,0],[1,1]]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("evolves cells across negative coordinates on the infinite grid -- [[-2,-1],[-1,-1],[0,-1]]", () => {
    expect(sorted(nextGeneration([[-1, -2], [-1, -1], [-1, 0]])))
      .toEqual([[-2, -1], [-1, -1], [0, -1]]);
  });
});
