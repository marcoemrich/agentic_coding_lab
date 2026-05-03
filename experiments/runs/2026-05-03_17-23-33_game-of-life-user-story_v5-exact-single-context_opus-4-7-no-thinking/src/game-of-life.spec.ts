import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty set when given empty set", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a lone living cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a living cell with only one living neighbor (underpopulation)", () => {
    // Two adjacent cells each have only 1 neighbor and die
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([1, 0]);
  });
  it("should keep alive a living cell with two living neighbors", () => {
    // Vertical line of three: middle cell has 2 neighbors and survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should keep alive a living cell with three living neighbors", () => {
    // 2x2 block: each cell has exactly 3 neighbors and all survive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a living cell with more than three living neighbors (overpopulation)", () => {
    // Plus shape: center [0,0] has 4 living neighbors
    const result = nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]);
    expect(result).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors (reproduction)", () => {
    // L-shape: dead cell at [1,1] has 3 living neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical line at negative x: middle cell survives, ends die, two new cells born horizontally
    const result = nextGeneration([[-1, -1], [-1, 0], [-1, 1]]);
    expect(result).toContainEqual([-1, 0]);
    expect(result).toContainEqual([-2, 0]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toHaveLength(3);
  });
});
