import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty set for empty grid", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });

  it("should kill lone cell with no neighbors", () => {
    const grid = new Set(["0,0"]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });

  it("should kill cell with one neighbor", () => {
    const grid = new Set(["0,0", "1,0"]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });

  it("should keep cell alive with exactly two neighbors", () => {
    const grid = new Set(["0,0", "1,0", "0,1"]);
    expect(nextGeneration(grid)).toEqual(new Set(["0,0"]));
  });

  it("should keep cell alive with exactly three neighbors", () => {
    const grid = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(nextGeneration(grid)).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });

  it("should kill cell with four neighbors", () => {
    const grid = new Set(["0,0", "1,0", "0,1", "1,1", "-1,0"]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });

  it("should revive dead cell with exactly three neighbors", () => {
    // Dead cell at 2,0 has three alive neighbors: (1,0), (0,1), (1,1)
    const grid = new Set(["1,0", "0,1", "1,1"]);
    expect(nextGeneration(grid)).toEqual(new Set(["1,0", "0,1", "1,1", "2,0"]));
  });

  it("Dead cell without exactly three neighbors stays dead", () => {
    // Dead cell at 2,1 has only one alive neighbor: (1,0)
    const grid = new Set(["1,0"]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });

  it("should handle multiple cells together", () => {
    // Multiple cells in different positions evolving simultaneously
    const grid = new Set(["0,0", "1,0", "2,0"]);
    expect(nextGeneration(grid)).toEqual(new Set(["1,-1", "1,0", "1,1"]));
  });

  it("should handle negative coordinates", () => {
    // Cells with negative coordinates should work like any other cells
    const grid = new Set(["-1,-1", "0,-1", "-1,0"]);
    expect(nextGeneration(grid)).toEqual(new Set(["-1,-1", "0,-1", "-1,0", "0,0"]));
  });
});
