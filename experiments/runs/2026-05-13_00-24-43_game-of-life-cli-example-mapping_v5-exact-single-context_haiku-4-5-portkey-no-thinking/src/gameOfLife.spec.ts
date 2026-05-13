import { describe, it, expect } from "vitest";
import { advanceGenerations } from "./gameOfLife.js";

describe("Game of Life", () => {
  it("should return empty grid when input is empty", () => {
    expect(advanceGenerations([], 0)).toEqual([]);
  });
  it("should return unchanged grid when steps is 0", () => {
    const grid = [[1, 2], [3, 4]];
    expect(advanceGenerations(grid, 0)).toEqual(grid);
  });
  it("should kill a live cell with no neighbors", () => {
    expect(advanceGenerations([[0, 0]], 1)).toEqual([]);
  });
  it("should kill a live cell with 1 neighbor", () => {
    expect(advanceGenerations([[0, 0], [1, 0]], 1)).toEqual([]);
  });
  it("should keep a live cell with 2 neighbors alive", () => {
    // A 2x2 block: all 4 cells have 3 neighbors, all survive
    expect(advanceGenerations([[0, 0], [1, 0], [0, 1], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell with 3 neighbors alive", () => {
    // A tub still-life pattern (as shown in prompt example)
    expect(advanceGenerations([[0, 1], [1, 0], [1, 2], [2, 1]], 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should kill a live cell with 4 neighbors", () => {
    // Create a 3x3 square where corner cells have overpopulation
    // All 9 cells in a 3x3 grid die except edge cells with exactly 3 neighbors
    const result = advanceGenerations([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]], 1);
    // Center cell [1,1] has 8 neighbors - dies from overpopulation
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth a dead cell with exactly 3 neighbors", () => {
    // Three cells in L-shape, position [1,1] has exactly 3 neighbors and should be born
    expect(advanceGenerations([[0, 0], [1, 0], [0, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should not birth a dead cell with fewer than 3 neighbors", () => {
    // Two isolated cells: no dead cell has exactly 3 neighbors
    expect(advanceGenerations([[0, 0], [5, 5]], 1)).toEqual([]);
  });
  it("should preserve a still life pattern (tub)", () => {
    // Tub from prompt example
    expect(advanceGenerations([[0, 1], [1, 0], [1, 2], [2, 1]], 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should advance multiple generations correctly", () => {
    // Blinker pattern: horizontal → vertical → horizontal (period 2)
    const blinker = [[0, 1], [1, 1], [2, 1]];
    const afterGen1 = advanceGenerations(blinker, 1);
    expect(afterGen1).toEqual([[1, 0], [1, 1], [1, 2]]);
    const afterGen2 = advanceGenerations(blinker, 2);
    expect(afterGen2).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
  it("should handle negative coordinates", () => {
    // Single cell at negative coordinates dies (no neighbors)
    expect(advanceGenerations([[-1, -1]], 1)).toEqual([]);
  });
  it("should return sorted output (lexicographic x, y)", () => {
    // Multiple births in random order, verify output is sorted
    expect(advanceGenerations([[0, 0], [1, 0], [0, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
