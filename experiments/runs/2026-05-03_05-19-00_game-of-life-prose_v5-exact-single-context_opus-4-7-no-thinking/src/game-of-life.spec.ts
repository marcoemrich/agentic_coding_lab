import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty set when given empty set", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a live cell with only one live neighbor (underpopulation)", () => {
    // Two adjacent cells - each has only 1 neighbor, both die
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([1, 0]);
  });
  it("should keep alive a live cell with two live neighbors", () => {
    // A vertical column of 3 cells - the middle cell has 2 neighbors and survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should keep alive a live cell with three live neighbors", () => {
    // 2x2 block - each cell has 3 neighbors, all survive (still life)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with four live neighbors (overpopulation)", () => {
    // Plus shape: center cell has 4 neighbors and dies
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(result).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life with exactly three live neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors and becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at negative x - middle survives
    const result = nextGeneration([[-5, -1], [-5, 0], [-5, 1]]);
    expect(result).toContainEqual([-5, 0]);
    // Reproduction: dead cells at (-4, 0) and (-6, 0) have 3 neighbors
    expect(result).toContainEqual([-4, 0]);
    expect(result).toContainEqual([-6, 0]);
  });
  it("should compute next generation for a blinker oscillator", () => {
    // Horizontal blinker -> vertical blinker
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([0, -1]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
  });
});
