import { describe, it, expect } from "vitest";
import { computeGeneration } from "./gameOfLife.js";

describe("Game of Life", () => {
  it("should return empty grid when input is empty and steps is 0", () => {
    const result = computeGeneration([], 0);
    expect(result).toEqual([]);
  });
  it("should return input unchanged when steps is 0", () => {
    const input = [[0, 0], [1, 1]];
    const result = computeGeneration(input, 0);
    expect(result).toEqual(input);
  });
  it("should kill isolated cell after 1 step", () => {
    // Single isolated cell with no neighbors
    const input = [[5, 5]];
    const result = computeGeneration(input, 1);
    // Isolated cell should die
    expect(result).toEqual([]);
  });
  it("should keep cell alive with 2 neighbors", () => {
    // A cell at (0, 0) with neighbors at (0, 1) and (1, 0) has 2 neighbors
    const input = [[0, 0], [0, 1], [1, 0]];
    const result = computeGeneration(input, 1);
    expect(result).toContainEqual([0, 0]);
  });
  it("should keep cell alive with 3 neighbors", () => {
    // A cell at (1, 1) with exactly 3 neighbors should survive
    // Place 3 cells around (1,1): (0,0), (0,1), (0,2)
    const input = [[0, 0], [0, 1], [0, 2]];
    const result = computeGeneration(input, 1);
    // Cell at (1, 1) has 3 neighbors and should be born OR survive
    expect(result).toContainEqual([0, 1]);
  });
  it("should birth cell with exactly 3 neighbors", () => {
    // Three cells forming a line at (0,0), (1,0), (2,0)
    // Dead cell at (1,1) has exactly 3 neighbors
    const input = [[0, 0], [1, 0], [2, 0]];
    const result = computeGeneration(input, 1);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle multiple generations", () => {
    // Test that steps > 1 applies generation multiple times
    const input = [[0, 0], [1, 0], [2, 0]];
    const result = computeGeneration(input, 2);
    // After step 1 from horizontal line: [[1, 1]]
    // After step 2 from [[1, 1]]: should be empty (isolated cell dies)
    expect(result).toEqual([]);
  });
  it("should output cells in lexicographic order (x asc, y asc)", () => {
    // Create unordered input
    const input = [[2, 1], [0, 0], [1, 1], [0, 1]];
    const result = computeGeneration(input, 0);
    // Should be sorted by x ascending, then y ascending
    const expected = [[0, 0], [0, 1], [1, 1], [2, 1]];
    expect(result).toEqual(expected);
  });
  it("should handle negative coordinates", () => {
    // Cells with negative coordinates
    const input = [[-2, -1], [-1, 0], [0, 1]];
    const result = computeGeneration(input, 0);
    // Should still sort correctly with negative coordinates (x asc, y asc)
    const expected = [[-2, -1], [-1, 0], [0, 1]];
    expect(result).toEqual(expected);
  });
});
