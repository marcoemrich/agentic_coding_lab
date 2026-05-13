import { describe, it, expect } from "vitest";
import { step } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when starting with no alive cells", () => {
    expect(step([], 1)).toEqual([]);
  });
  it("should return input unchanged when steps is 0", () => {
    expect(step([[1, 2]], 0)).toEqual([[1, 2]]);
  });
  it("should kill a single alive cell (underpopulation)", () => {
    expect(step([[0, 0]], 1)).toEqual([]);
  });
  it("should make a dead cell with exactly 3 alive neighbors come alive", () => {
    // [1,0], [0,1], [1,1] are alive; their common dead neighbor [0,0] has 3 alive neighbors
    expect(step([[1, 0], [0, 1], [1, 1]], 1)).toContainEqual([0, 0]);
  });
  it("should keep an alive cell with 2 alive neighbors alive", () => {
    // [0,0] has neighbors [1,0] and [0,1] — exactly 2 alive neighbors, should survive
    expect(step([[0, 0], [1, 0], [0, 1]], 1)).toContainEqual([0, 0]);
  });
  it("should advance a blinker one generation", () => {
    // Horizontal blinker: [[0,0],[1,0],[2,0]] → vertical blinker: [[1,-1],[1,0],[1,1]]
    const result = step([[0, 0], [1, 0], [2, 0]], 1);
    expect(result).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
});
