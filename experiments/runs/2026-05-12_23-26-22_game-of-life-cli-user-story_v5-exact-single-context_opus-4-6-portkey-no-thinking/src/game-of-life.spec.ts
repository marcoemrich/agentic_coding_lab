import { describe, it, expect } from "vitest";
import { advanceGameOfLife } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when given no alive cells", () => {
    const result = advanceGameOfLife([], 1);
    expect(result).toEqual([]);
  });
  it("should return alive cells unchanged when steps is 0", () => {
    const result = advanceGameOfLife([[1, 2], [3, 4]], 0);
    expect(result).toEqual([[1, 2], [3, 4]]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = advanceGameOfLife([[0, 0]], 1);
    expect(result).toEqual([]);
  });
  it("should keep a block pattern alive (still life with 3 neighbors each)", () => {
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const result = advanceGameOfLife(block, 1);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should bring a dead cell to life when it has exactly 3 alive neighbors", () => {
    const result = advanceGameOfLife([[0, 0], [0, 1], [1, 0]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Plus pattern: center [1,1] has 4 neighbors → dies
    const plus = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = advanceGameOfLife(plus, 1);
    expect(result).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should handle multiple steps (blinker oscillator)", () => {
    const horizontal = [[0, 0], [0, 1], [0, 2]];
    const result = advanceGameOfLife(horizontal, 2);
    expect(result).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    const unsorted = [[3, 1], [1, 2], [1, 0], [2, 5]];
    const result = advanceGameOfLife(unsorted, 0);
    expect(result).toEqual([[1, 0], [1, 2], [2, 5], [3, 1]]);
  });
  it("should handle negative coordinates", () => {
    const block = [[-1, -1], [-1, 0], [0, -1], [0, 0]];
    const result = advanceGameOfLife(block, 1);
    expect(result).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
});
