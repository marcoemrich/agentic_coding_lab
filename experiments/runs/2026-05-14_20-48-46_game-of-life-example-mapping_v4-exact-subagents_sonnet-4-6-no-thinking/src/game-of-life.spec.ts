import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty array for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors (survival)", () => {
    // A column of 3 live cells: [(0,0),(0,1),(0,2)] - center (0,1) has exactly 2 live neighbors
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([0, 2]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors (survival)", () => {
    // [(0,0), (1,0), (2,0), (1,1)] - cell (1,0) has neighbors (0,0),(2,0),(1,1) = 3 live neighbors, should survive
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // cell (1,1) has neighbors (0,0),(1,0),(2,0),(0,1) = 4 live neighbors → dies
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should make a dead cell with exactly 3 live neighbors become alive (reproduction)", () => {
    // Dead cell (1,1) has exactly 3 live neighbors: (0,0),(1,0),(0,1) → becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should produce correct next generation for a blinker oscillator", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(3);
  });
  it("should produce correct next generation for a block still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(4);
  });
});
