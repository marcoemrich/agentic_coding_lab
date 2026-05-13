import { describe, it, expect } from "vitest";
import { step } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty when given empty cells and steps 0", () => {
    expect(step([], 0)).toEqual([]);
  });
  it("should return cells unchanged when steps is 0", () => {
    expect(step([[1, 2], [3, 4]], 0)).toEqual([[1, 2], [3, 4]]);
  });
  it("should kill a single live cell with no neighbors after one step", () => {
    expect(step([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a cell alive with exactly two neighbors after one step", () => {
    // [0,0] has neighbors [0,1] and [1,0] — exactly 2, so it survives
    expect(step([[0, 0], [0, 1], [1, 0]], 1)).toContainEqual([0, 0]);
  });
  it("should keep a cell alive with exactly three neighbors after one step", () => {
    // [0,0] has neighbors [1,0], [0,1], [-1,0] — exactly 3, so it survives
    expect(step([[0, 0], [1, 0], [0, 1], [-1, 0]], 1)).toContainEqual([0, 0]);
  });
  it("should birth a dead cell with exactly three neighbors after one step", () => {
    // [0,0] is dead; its neighbors [1,0], [0,1], [-1,0] are alive — exactly 3, so [0,0] is born
    expect(step([[1, 0], [0, 1], [-1, 0]], 1)).toContainEqual([0, 0]);
  });
  it("should return aliveCells sorted lexicographically by x then y", () => {
    // steps=0 returns input unchanged; sorting must be applied to output
    expect(step([[3, 0], [1, 0], [2, 0]], 0)).toEqual([[1, 0], [2, 0], [3, 0]]);
  });
});
