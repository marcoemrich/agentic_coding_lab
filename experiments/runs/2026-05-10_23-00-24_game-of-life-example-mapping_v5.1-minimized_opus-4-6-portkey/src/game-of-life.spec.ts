import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation, 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 1]])).toContainEqual([1, 0]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker pattern", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const sort = (cells: [number, number][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(nextGeneration(vertical))).toEqual(sort(horizontal));
    expect(sort(nextGeneration(horizontal))).toEqual(sort(vertical));
  });
});
