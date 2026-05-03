import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return an empty set of living cells when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a living cell with only one living neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a living cell alive with two living neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [-1, 0]])).toContainEqual([0, 0]);
  });
  it("should keep a living cell alive with three living neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("should kill a living cell with four living neighbors (overpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]])).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors (reproduction)", () => {
    expect(nextGeneration([[0, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("should handle living cells with negative coordinates", () => {
    const result = nextGeneration([[-2, -1], [-2, -2], [-2, -3]]);
    expect(result).toContainEqual([-2, -2]);
    expect(result).toContainEqual([-1, -2]);
    expect(result).toContainEqual([-3, -2]);
    expect(result).not.toContainEqual([-2, -1]);
    expect(result).not.toContainEqual([-2, -3]);
  });
});
