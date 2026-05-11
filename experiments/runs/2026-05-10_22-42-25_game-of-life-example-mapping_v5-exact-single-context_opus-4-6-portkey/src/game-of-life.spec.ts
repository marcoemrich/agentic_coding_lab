import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill cells with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a cell alive with exactly two neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a cell alive with exactly three neighbors (survival)", () => {
    // L-shape: each corner cell has 2 neighbors, but (0,0) has 3 neighbors: (1,0),(0,1),(1,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life with exactly three live neighbors (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1) — dead cell (1,1) has exactly 3 live neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 neighbors → dies
    const result = nextGeneration([[1, 2], [0, 1], [1, 1], [2, 1], [1, 0]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should keep a block pattern stable (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern", () => {
    // Vertical blinker → horizontal blinker → vertical blinker
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(vertical);
    expect(gen1).toHaveLength(3);
    expect(gen1).toContainEqual([-1, 1]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toContainEqual([1, 1]);

    const gen2 = nextGeneration(gen1);
    expect(gen2).toHaveLength(3);
    expect(gen2).toContainEqual([0, 0]);
    expect(gen2).toContainEqual([0, 1]);
    expect(gen2).toContainEqual([0, 2]);
  });
});
