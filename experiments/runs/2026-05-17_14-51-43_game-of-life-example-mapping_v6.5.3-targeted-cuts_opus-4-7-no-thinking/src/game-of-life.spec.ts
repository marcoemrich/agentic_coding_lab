import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep alive a cell with 2 live neighbors (survival)", () => {
    // Horizontal blinker: center cell (1,0) has 2 neighbors → survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep alive a cell with 3 live neighbors (survival)", () => {
    // 2x2 block: each cell has 3 neighbors → all survive (still life)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 neighbors → dies
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors → becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern correctly", () => {
    // Vertical blinker → horizontal blinker
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // 2x2 block at negative coordinates → still life
    const result = nextGeneration([[-5, -5], [-4, -5], [-5, -4], [-4, -4]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([-5, -5]);
    expect(result).toContainEqual([-4, -5]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
