import { describe, it, expect } from "vitest";
import { advanceGameOfLife } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when given no alive cells and 0 steps", () => {
    expect(advanceGameOfLife([], 0)).toEqual([]);
  });
  it("should return the single alive cell unchanged when steps is 0", () => {
    expect(advanceGameOfLife([[5, 5]], 0)).toEqual([[5, 5]]);
  });
  it("should kill a single cell after 1 step (underpopulation)", () => {
    expect(advanceGameOfLife([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a block (2x2 square) unchanged after 1 step (survival)", () => {
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(advanceGameOfLife(block, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker after 1 step (reproduction and underpopulation)", () => {
    const horizontalBlinker = [[0, 0], [1, 0], [2, 0]];
    expect(advanceGameOfLife(horizontalBlinker, 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should return a blinker to its original state after 2 steps", () => {
    const horizontalBlinker = [[0, 0], [1, 0], [2, 0]];
    expect(advanceGameOfLife(horizontalBlinker, 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should handle negative coordinates", () => {
    const blinker = [[-1, -1], [0, -1], [1, -1]];
    expect(advanceGameOfLife(blinker, 1)).toEqual([[0, -2], [0, -1], [0, 0]]);
  });
  it("should return alive cells sorted lexicographically", () => {
    const unsorted = [[2, 0], [0, 0], [1, 0]];
    expect(advanceGameOfLife(unsorted, 0)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
});
