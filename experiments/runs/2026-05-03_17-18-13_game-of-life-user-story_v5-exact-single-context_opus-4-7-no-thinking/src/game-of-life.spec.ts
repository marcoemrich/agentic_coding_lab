import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty set when given an empty set of living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a living cell with only one living neighbor (underpopulation)", () => {
    // Two adjacent living cells: each has exactly one neighbor → both die
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([1, 0]);
  });
  it("should keep a living cell alive with two living neighbors", () => {
    // Vertical blinker: three cells in a column
    // Middle cell (0,0) has 2 neighbors and survives
    const result = nextGeneration([[0, 1], [0, 0], [0, -1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("should keep a living cell alive with three living neighbors", () => {
    // Square block 2x2: each cell has exactly 3 living neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a living cell with more than three living neighbors (overpopulation)", () => {
    // Center cell at (0,0) with 4 living neighbors → dies
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(result).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors", () => {
    // Three cells in an L-shape: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 living neighbors.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle living cells with negative coordinates", () => {
    // Vertical blinker centered at negative coordinates
    const result = nextGeneration([[-5, -4], [-5, -5], [-5, -6]]);
    expect(result).toContainEqual([-5, -5]);
    // Birth at horizontal neighbors
    expect(result).toContainEqual([-4, -5]);
    expect(result).toContainEqual([-6, -5]);
  });
});
