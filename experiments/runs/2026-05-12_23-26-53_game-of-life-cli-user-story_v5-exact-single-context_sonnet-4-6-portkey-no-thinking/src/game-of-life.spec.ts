import { describe, it, expect } from "vitest";
import { step } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when no cells are alive", () => {
    expect(step([], 1)).toEqual([]);
  });
  it("should return cells unchanged when steps is 0", () => {
    expect(step([[1, 2]], 0)).toEqual([[1, 2]]);
  });
  it("should kill a lone living cell with no neighbors (underpopulation)", () => {
    expect(step([[0, 0]], 1)).toEqual([]);
  });
  it("should keep alive a cell with exactly two neighbors", () => {
    // blinker: [0,0],[1,0],[2,0] — center [1,0] has 2 neighbors, survives
    // end cells [0,0],[2,0] have 1 neighbor each, die
    // dead cell [1,-1] and [1,1] each get 3 live neighbors, become alive
    expect(step([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep alive a cell with exactly three neighbors", () => {
    // 2x2 block is stable — each cell has exactly 3 neighbors
    expect(step([[0, 0], [1, 0], [0, 1], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    // + shape: center [0,0] has 4 neighbors → dies from overpopulation
    const result = step([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], 1);
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });
  it("should bring a dead cell to life with exactly three neighbors", () => {
    // L-shape: [0,0],[1,0],[0,1] — dead cell [1,1] has 3 neighbors, becomes alive
    const result = step([[0, 0], [1, 0], [0, 1]], 1);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should advance multiple steps correctly", () => {
    // blinker oscillates: 2 steps returns to original configuration
    expect(step([[0, 0], [1, 0], [2, 0]], 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should sort output cells lexicographically by x then y", () => {
    // 2x2 block is stable — output must be sorted by x asc, then y asc
    const result = step([[1, 1], [0, 1], [1, 0], [0, 0]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
