import { describe, it, expect } from "vitest";
import { evolve } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty cells when given empty cells", () => {
    expect(evolve([], 1)).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(evolve([[0, 0]], 1)).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly three neighbors", () => {
    // Three cells in an L-shape: dead cell at [0,0] has exactly 3 neighbors
    expect(evolve([[0, 1], [1, 0], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive when it has exactly two neighbors", () => {
    // Horizontal blinker: middle cell [1,0] has 2 neighbors and survives
    expect(evolve([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive when it has exactly three neighbors", () => {
    // 2x2 block: each cell has exactly 3 neighbors, block is a still life
    expect(evolve([[0, 0], [0, 1], [1, 0], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    // Plus shape: center [1,1] has 4 neighbors and dies
    const plus = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = evolve(plus, 1);
    expect(result).not.toContainEqual([1, 1]); // center dies
  });
  it("should advance multiple steps", () => {
    // Blinker has period 2: after 2 steps it returns to original
    const blinker = [[0, 0], [1, 0], [2, 0]];
    expect(evolve(blinker, 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    // Input deliberately unsorted, steps: 0 returns config unchanged but sorted
    const unsorted = [[3, 1], [-1, 2], [-1, -1], [0, 0]];
    expect(evolve(unsorted, 0)).toEqual([[-1, -1], [-1, 2], [0, 0], [3, 1]]);
  });
});
