import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should transform a vertical 3-cell blinker into a horizontal 3-cell blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];
    expect([...result].sort(sortFn)).toEqual([[-1, 1], [0, 1], [1, 1]].sort(sortFn));
  });
  it("should leave a 2x2 block unchanged (still life)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];
    expect([...result].sort(sortFn)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort(sortFn));
  });
  it("should support negative coordinates", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];
    expect([...result].sort(sortFn)).toEqual([[-6, -4], [-5, -4], [-4, -4]].sort(sortFn));
  });
});
