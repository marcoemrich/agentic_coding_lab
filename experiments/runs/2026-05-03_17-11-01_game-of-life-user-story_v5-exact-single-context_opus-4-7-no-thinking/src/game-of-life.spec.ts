import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty set when given an empty set of living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a living cell with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a living cell alive with two living neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a living cell alive with three living neighbors", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const result = nextGeneration(block);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a living cell with more than three living neighbors (overpopulation)", () => {
    const plus = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]] as [number, number][];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors (reproduction)", () => {
    const lShape = [[0, 0], [1, 0], [0, 1]] as [number, number][];
    const result = nextGeneration(lShape);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    const block = [[-1, -1], [0, -1], [-1, 0], [0, 0]] as [number, number][];
    const result = nextGeneration(block);
    expect(result).toContainEqual([-1, -1]);
    expect(result).toContainEqual([0, -1]);
    expect(result).toContainEqual([-1, 0]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toHaveLength(4);
  });
});
