import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a cell alive that has exactly 2 live neighbors (survival)", () => {
    const liveCells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(liveCells);
    expect(result).toContainEqual([0, 0]);
  });
  it("should keep a cell alive that has exactly 3 live neighbors (survival)", () => {
    const liveCells: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(liveCells);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a cell that has 4 live neighbors (overpopulation)", () => {
    const liveCells: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = nextGeneration(liveCells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const liveCells: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(liveCells);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern to its alternate form", () => {
    const blinkerVertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerVertical);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
