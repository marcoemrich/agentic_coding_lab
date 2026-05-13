import { describe, it, expect } from "vitest";
import { advanceGenerations } from "./gameOfLife.js";

describe("Conway's Game of Life", () => {
  it("should return empty set when input is empty after any steps", () => {
    const result = advanceGenerations([], 5);
    expect(result).toEqual([]);
  });
  it("should kill a single alive cell with zero neighbors", () => {
    const result = advanceGenerations([[0, 0]], 1);
    expect(result).toEqual([]);
  });
  it("should return unchanged configuration when steps is zero", () => {
    const result = advanceGenerations([[0, 0], [1, 1]], 0);
    expect(result).toEqual([[0, 0], [1, 1]]);
  });
  it("should kill two isolated alive cells", () => {
    const result = advanceGenerations([[0, 0], [2, 2]], 1);
    expect(result).toEqual([]);
  });
  it("should preserve a 2x2 block (4 cells in square formation)", () => {
    // 2x2 block: each cell has 3 neighbors, so all survive
    const result = advanceGenerations([[0, 0], [0, 1], [1, 0], [1, 1]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should cycle a horizontal line of 3 cells (blinker pattern)", () => {
    // Horizontal line: [0,0], [0,1], [0,2]
    // After 1 step becomes vertical: [0,0], [0,1], [0,2]
    // Wait, let me reconsider. Horizontal at y=1: [-1,1], [0,1], [1,1]
    // After 1 step becomes vertical at x=0: [0,0], [0,1], [0,2]
    const result = advanceGenerations([[-1, 1], [0, 1], [1, 1]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("should create living cells from dead cells with exactly 3 neighbors", () => {
    // Three cells in an L shape: [0,0], [1,0], [0,1]
    // The dead cell at [1,1] has exactly 3 neighbors and should become alive
    const result = advanceGenerations([[0, 0], [1, 0], [0, 1]], 1);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should advance multiple generations correctly", () => {
    // Blinker: 3 cells in a row oscillate between horizontal and vertical
    // Gen 0: [-1,1], [0,1], [1,1] (horizontal)
    // Gen 1: [0,0], [0,1], [0,2] (vertical)
    // Gen 2: [-1,1], [0,1], [1,1] (horizontal) - back to start
    const result = advanceGenerations([[-1, 1], [0, 1], [1, 1]], 2);
    expect(result).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should handle negative coordinates", () => {
    // Test with negative coordinates
    // Block at negative position: [-1,-1], [-1,0], [0,-1], [0,0]
    const result = advanceGenerations([[-1, -1], [-1, 0], [0, -1], [0, 0]], 1);
    expect(result).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
  it("should return lexicographically sorted output", () => {
    // Input in reverse order, output should be sorted by x then y
    const result = advanceGenerations([[1, 1], [0, 0]], 0);
    expect(result).toEqual([[0, 0], [1, 1]]);
  });
});
