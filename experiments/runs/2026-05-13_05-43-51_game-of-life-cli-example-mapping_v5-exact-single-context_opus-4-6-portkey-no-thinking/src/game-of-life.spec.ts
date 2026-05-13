import { describe, it, expect } from "vitest";
import { advanceGame } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array for empty grid after one step", () => {
    expect(advanceGame([], 1)).toEqual([]);
  });
  it("should return input unchanged when steps is 0", () => {
    expect(advanceGame([[5, 5]], 0)).toEqual([[5, 5]]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(advanceGame([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a block (2x2) stable (survival with 3 neighbors)", () => {
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(advanceGame(block, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker (3 in a row)", () => {
    const horizontalBlinker = [[-1, 0], [0, 0], [1, 0]];
    expect(advanceGame(horizontalBlinker, 1)).toEqual([[0, -1], [0, 0], [0, 1]]);
  });
  it("should return output sorted lexicographically by x then y", () => {
    // L-triomino becomes a block; verify output is sorted by x then y
    const lTriomino = [[1, 0], [0, 1], [0, 0]]; // input intentionally unsorted
    expect(advanceGame(lTriomino, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should advance multiple steps correctly", () => {
    // Blinker has period 2: after 2 steps it returns to original
    const horizontalBlinker = [[-1, 0], [0, 0], [1, 0]];
    expect(advanceGame(horizontalBlinker, 2)).toEqual([[-1, 0], [0, 0], [1, 0]]);
  });
});
