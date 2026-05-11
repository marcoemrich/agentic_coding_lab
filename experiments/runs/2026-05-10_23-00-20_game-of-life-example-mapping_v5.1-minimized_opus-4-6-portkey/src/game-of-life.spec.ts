import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation, 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("should keep live cell alive with exactly 2 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result.sort()).toEqual([[1, -1], [1, 0], [1, 1]].sort());
  });
  it("should keep live cell alive with exactly 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 0]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1]].sort());
  });
  it("should kill live cell with more than 3 neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]].sort());
  });
  it("should preserve a block still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
    expect(nextGeneration(horizontal).sort()).toEqual(vertical.sort());
  });
});
