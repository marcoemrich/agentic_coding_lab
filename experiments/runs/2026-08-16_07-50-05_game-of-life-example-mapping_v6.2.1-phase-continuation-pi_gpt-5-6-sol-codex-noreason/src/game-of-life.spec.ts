import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("keeps an empty grid empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces a dead cell with exactly three neighbors -- (1,1) becomes alive in [(0,0),(1,0),(0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("preserves a live center cell with three neighbors -- (1,1) survives in [(0,0),(1,0),(2,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills a live center cell with more than three neighbors -- (1,1) dies in the specified six-cell ring", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).toEqual([
      [0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2],
    ]);
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns a vertical blinker into a horizontal blinker -- [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("returns a blinker to its original state after two generations -- vertical to horizontal to vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(vertical))).toEqual(vertical);
  });
  it("handles negative coordinates on the infinite grid -- a blinker centered at (-2,-3) oscillates correctly", () => {
    expect(nextGeneration([[-2, -4], [-2, -3], [-2, -2]])).toEqual([
      [-3, -3], [-2, -3], [-1, -3],
    ]);
  });
});
