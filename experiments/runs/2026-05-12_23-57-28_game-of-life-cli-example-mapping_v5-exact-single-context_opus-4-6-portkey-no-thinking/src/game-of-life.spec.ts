import { describe, it, expect } from "vitest";
import { advanceGameOfLife } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when given no alive cells", () => {
    expect(advanceGameOfLife([], 1)).toEqual([]);
  });
  it("should return alive cells unchanged when steps is 0", () => {
    expect(advanceGameOfLife([[5, 5]], 0)).toEqual([[5, 5]]);
  });
  it("should kill a lone cell with no neighbors (underpopulation)", () => {
    expect(advanceGameOfLife([[1, 1]], 1)).toEqual([]);
  });
  it("should create a new cell when exactly 3 neighbors are alive (reproduction)", () => {
    expect(advanceGameOfLife([[0, 0], [0, 1], [1, 0]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive that has 2 or 3 neighbors (survival)", () => {
    // Blinker: horizontal line → vertical line. Center cell (1,0) survives with 2 neighbors.
    expect(advanceGameOfLife([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Plus/cross pattern: center (1,1) has 4 neighbors → dies
    expect(advanceGameOfLife([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], 1)).toEqual(
      [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]
    );
  });
  it("should keep a block still life unchanged after one generation", () => {
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(advanceGameOfLife(block, 1)).toEqual(block);
  });
  it("should advance multiple steps", () => {
    // Blinker has period 2: after 2 steps it returns to original position
    expect(advanceGameOfLife([[0, 0], [1, 0], [2, 0]], 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it.todo("should return alive cells sorted lexicographically");
});
