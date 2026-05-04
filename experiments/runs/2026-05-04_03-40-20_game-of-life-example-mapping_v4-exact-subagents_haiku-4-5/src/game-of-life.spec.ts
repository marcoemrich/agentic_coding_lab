import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single cell due to underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep live cell with 2 neighbors", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toEqual([[0, 0]]);
  });
  it("should keep live cell with 3 neighbors", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toEqual([[0, 0]]);
  });
  it("should kill live cell with 1 neighbor", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should kill live cell with 4 neighbors", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).toEqual([]);
  });
  it("should resurrect dead cell with exactly 3 neighbors", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1]])).toEqual([[0, 0]]);
  });
  it("should handle multiple live cells in single generation", () => {
    // Two vertically-stacked cells with a cell below
    // Both survive: each has 1 neighbor (forming a 3-cell line)
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
