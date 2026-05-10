import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return empty grid for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single isolated cell", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid for two isolated cells", () => {
    expect(nextGeneration([[0, 0], [2, 2]])).toEqual([]);
  });
  it("should evolve three in a row to vertical blinker", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("should keep two by two block stable", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should create live cell from dead cell with exactly 3 neighbors", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill live cell with 4 neighbors (overpopulation)", () => {
    // Cell [1,1] has 4 neighbors: [1,0], [0,1], [2,1], [1,2]
    // It should die due to overpopulation
    expect(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]])).toEqual([]);
  });
});
