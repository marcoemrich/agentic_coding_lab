import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty board for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty board for single living cell (dies from underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep two adjacent cells alive if they form a stable pair", () => {
    expect(nextGeneration([[0, 0], [0, 1]])).toEqual([[0, 0], [0, 1]]);
  });
  it("should eliminate overpopulated cell with 4 neighbors", () => {
    // A cell at [0, 0] with 4 neighbors should die from overpopulation
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1], [-1, 0]])).toEqual([[0, 1], [1, 0], [1, 1], [-1, 0]]);
  });
  it("should create new cell from reproduction (dead cell with exactly 3 neighbors)", () => {
    // Three cells arranged so [0, 1] (empty) has exactly 3 neighbors: [0, 0], [1, 0], [1, 1]
    expect(nextGeneration([[0, 0], [1, 0], [1, 1]])).toEqual([[0, 0], [1, 0], [1, 1], [0, 1]]);
  });
  it("should handle negative coordinates correctly", () => {
    // A cell at [-1, -1] with 2 neighbors should survive
    expect(nextGeneration([[-1, -1], [-1, 0], [0, -1]])).toEqual([[-1, -1], [-1, 0], [0, -1]]);
  });
  it("should process multiple cells and apply all rules in one generation", () => {
    // A configuration with 4 cells where:
    // - [0,0] has 3 neighbors (survives)
    // - [0,1] has 3 neighbors (survives)
    // - [1,0] has 3 neighbors (survives)
    // - [1,1] has 3 neighbors (survives)
    // - [-1,0] should die (has 1 neighbor)
    // - [-1,1] should be born (dead cell with 3 neighbors: [0,0], [0,1], [1,1])
    const board = [[0, 0], [0, 1], [1, 0], [1, 1], [-1, 0]];
    const expected = [[0, 0], [0, 1], [1, 0], [1, 1], [-1, 1]];
    expect(nextGeneration(board)).toEqual(expected);
  });
});
