import { describe, it, expect } from "vitest";
import { simulate } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty alive cells when given empty alive cells and 0 steps", () => {
    expect(simulate([], 0)).toEqual([]);
  });
  it("should kill a single alive cell after one step (underpopulation)", () => {
    expect(simulate([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a cell alive that has exactly two living neighbors", () => {
    // Horizontal blinker: middle cell [1,0] has 2 neighbors → survives
    expect(simulate([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive that has exactly three living neighbors", () => {
    // 2x2 block: each cell has exactly 3 neighbors → all survive (still life)
    expect(simulate([[0, 0], [0, 1], [1, 0], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell that has four living neighbors (overpopulation)", () => {
    // Plus shape: center [1,1] has 4 neighbors → dies
    const plus = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = simulate(plus, 1);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors", () => {
    // L-shape: dead cell [1,1] has 3 alive neighbors → born, forming a block
    expect(simulate([[0, 0], [0, 1], [1, 0]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should advance multiple generations when steps is greater than 1", () => {
    // Blinker oscillates with period 2: after 2 steps it returns to original
    expect(simulate([[0, 0], [1, 0], [2, 0]], 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    // Input in non-sorted order with negative coordinates, steps=0 returns sorted
    expect(simulate([[1, 0], [-1, 2], [0, -1]], 0)).toEqual([[-1, 2], [0, -1], [1, 0]]);
  });
});
