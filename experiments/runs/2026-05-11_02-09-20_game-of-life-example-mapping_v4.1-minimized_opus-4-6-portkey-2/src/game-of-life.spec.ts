import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty grid when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a cell alive that has exactly two live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(
      expect.arrayContaining([[1, 0]])
    );
  });
  it("should keep a cell alive that has exactly three live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toEqual(
      expect.arrayContaining([[1, 0]])
    );
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(
      expect.arrayContaining([[1, 1]])
    );
  });
  it("should kill a cell that has four live neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toEqual(
      expect.arrayContaining([[1, 1]])
    );
  });
  it("should maintain a block still life (2x2 square) unchanged across a generation", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort(block));
  });
  it("should oscillate a blinker (three cells in a line) to its alternate phase", () => {
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
});
