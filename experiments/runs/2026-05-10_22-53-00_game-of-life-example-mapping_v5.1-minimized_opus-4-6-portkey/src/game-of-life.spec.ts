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
  it("should create a live cell from a dead cell with exactly 3 neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("should keep a block (2x2 square) unchanged as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
});
