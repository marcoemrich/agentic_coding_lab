import { describe, it, expect } from "vitest";
import { simulate } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid after one step", () => {
    expect(simulate([], 1)).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(simulate([[0, 0]], 1)).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    // Three cells in an L-shape: [0,0], [1,0], [0,1]
    // Each existing cell has 2 neighbors → survives
    // Dead cell [1,1] has exactly 3 neighbors → comes alive
    // Result: 2x2 block (sorted by x then y)
    const result = simulate([[0, 0], [1, 0], [0, 1]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a living cell alive when it has 2 neighbors", () => {
    // Horizontal blinker: center cell [1,0] has 2 neighbors → survives
    // End cells [0,0] and [2,0] have 1 neighbor each → die
    // Dead cells [1,-1] and [1,1] each have 3 neighbors → born
    // Result: vertical blinker
    const result = simulate([[0, 0], [1, 0], [2, 0]], 1);
    expect(result).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should kill a living cell with more than 3 neighbors (overpopulation)", () => {
    // Plus shape: center [1,1] has 4 neighbors → dies (overpopulation)
    // Arms [0,1],[1,0],[1,2],[2,1] each have 3 neighbors → survive
    // Corners [0,0],[0,2],[2,0],[2,2] each have 3 dead-cell neighbors → born
    // Result: ring with hollow center
    const result = simulate([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should oscillate a blinker pattern", () => {
    // Horizontal blinker → vertical blinker after 1 step
    const horizontal = [[0, 0], [1, 0], [2, 0]];
    const vertical = [[1, -1], [1, 0], [1, 1]];
    expect(simulate(horizontal, 1)).toEqual(vertical);
  });
  it("should return input unchanged when steps is 0", () => {
    const cells = [[0, 0], [1, 0], [2, 0]];
    expect(simulate(cells, 0)).toEqual(cells);
  });
  it("should iterate correctly over multiple steps", () => {
    // Blinker has period 2: after 2 steps returns to original
    const horizontal = [[0, 0], [1, 0], [2, 0]];
    expect(simulate(horizontal, 2)).toEqual(horizontal);
  });
  it("should return output sorted lexicographically by x then y", () => {
    // Block pattern (still life) given in unsorted order
    const unsorted = [[1, 1], [0, 0], [1, 0], [0, 1]];
    const sorted = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(simulate(unsorted, 1)).toEqual(sorted);
  });
  it("should handle negative coordinates correctly", () => {
    // L-shape at negative coordinates
    const cells = [[-1, -1], [0, -1], [-1, 0]];
    // Each has 2 neighbors → survives; [-0,0] has 3 neighbors → born
    // Result: 2x2 block at negative coords
    expect(simulate(cells, 1)).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
});
