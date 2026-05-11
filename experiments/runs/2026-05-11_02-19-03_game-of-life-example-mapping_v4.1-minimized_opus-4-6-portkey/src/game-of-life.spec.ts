import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid when given an empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should keep a live cell alive when it has exactly 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 1], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should preserve a block pattern as a still life (2x2 square unchanged)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker pattern from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});
