import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive that has exactly 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a live cell alive that has exactly 3 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell that has 4 live neighbors (overpopulation)", () => {
    const cross = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(cross);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life that has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a block pattern unchanged as a still life", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = (cells: number[][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(block));
  });
  it("should oscillate a blinker pattern to its alternate form", () => {
    const blinkerGen0 = [[0, 0], [0, 1], [0, 2]];
    const blinkerGen1 = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(blinkerGen0);
    const sorted = (cells: number[][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(blinkerGen1));
  });
});
