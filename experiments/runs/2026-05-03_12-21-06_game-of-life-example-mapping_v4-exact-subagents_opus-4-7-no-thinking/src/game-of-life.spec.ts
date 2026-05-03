// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a live cell with two live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep alive a live cell with three live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with four live neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("should keep a block unchanged across generations (still life)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(result).toHaveLength(4);
  });
});
