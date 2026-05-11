import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const currentGen = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(currentGen);
    const sorted = (g: number[][]) => [...g].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors (survival)", () => {
    const currentGen = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(currentGen);
    expect(result).toContainEqual([0, 1]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors (survival)", () => {
    const currentGen = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(currentGen);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell when it has 4 or more live neighbors (overpopulation)", () => {
    const currentGen = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(currentGen);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should keep a block pattern stable across generations (still life)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = (g: number[][]) => [...g].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(block));
  });
  it("should oscillate a blinker pattern to its alternate form", () => {
    const blinkerGen0 = [[0, 0], [0, 1], [0, 2]];
    const blinkerGen1 = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(blinkerGen0);
    const sorted = (g: number[][]) => [...g].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(blinkerGen1));
  });
});
