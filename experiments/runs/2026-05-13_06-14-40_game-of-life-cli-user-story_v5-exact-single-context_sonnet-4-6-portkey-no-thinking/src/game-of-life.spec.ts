import { describe, it, expect } from "vitest";
import { step } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when no cells are alive", () => {
    expect(step([], 1)).toEqual([]);
  });
  it("should return cells unchanged when steps is 0", () => {
    expect(step([[1, 2]], 0)).toEqual([[1, 2]]);
  });
  it("should kill a single living cell with no neighbors", () => {
    expect(step([[0, 0]], 1)).toEqual([]);
  });
  it("should kill two living cells that are neighbors of each other but lack sufficient neighbors", () => {
    expect(step([[0, 0], [1, 0]], 1)).toEqual([]);
  });
  it("should keep alive cells in a 2x2 block (stable configuration)", () => {
    expect(step([[0, 0], [0, 1], [1, 0], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a three-cell horizontal line (blinker) after one step", () => {
    expect(step([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should sort output cells lexicographically by x then y", () => {
    // 2x2 block is stable and should be returned sorted: x asc, then y asc
    expect(step([[1, 1], [0, 0], [1, 0], [0, 1]], 0)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
