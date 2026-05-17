import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    // Two adjacent cells, each has only 1 neighbor → both die
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with 2 live neighbors (survival)", () => {
    // Vertical blinker: center cell (0,1) has 2 live neighbors, should survive
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should kill a live cell with 4 live neighbors (overpopulation)", () => {
    // X-shape: center (1,1) has 4 diagonal neighbors → dies from overpopulation
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: cells (0,0), (1,0), (0,1). Dead cell (1,1) has exactly 3 live neighbors → becomes alive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a live cell alive with 3 live neighbors (survival)", () => {
    // Block (still life): each cell has 3 live neighbors → all survive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern correctly", () => {
    // Blinker Gen 0: vertical → Gen 1: horizontal
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Block at negative coordinates is still a stable still life
    const result = nextGeneration([[-5, -5], [-4, -5], [-5, -4], [-4, -4]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([-5, -5]);
    expect(result).toContainEqual([-4, -5]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
