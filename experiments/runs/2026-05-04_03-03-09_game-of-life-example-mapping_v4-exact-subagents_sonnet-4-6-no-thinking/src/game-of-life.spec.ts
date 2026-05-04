import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid when single cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid when two cells die from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors", () => {
    // Center cell (1,0) has exactly 2 neighbors: (0,0) and (2,0) - it survives
    // Outer cells (0,0) and (2,0) each have 1 neighbor - they die
    // Dead cell (1,1) has 3 live neighbors - it is born
    // Dead cell (1,-1) has 3 live neighbors - it is born
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors", () => {
    // Live cell at (1,1) has exactly 3 live neighbors: (0,0), (1,0), (2,0) - it survives
    // All 4 live cells survive (each has 2 or 3 neighbors)
    // Dead cells (0,1), (1,-1), (2,1) each have 3 live neighbors - they are born
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, -1], [1, 0], [1, 1], [2, 0], [2, 1]]);
  });
  it("should kill a live cell when it has more than 3 live neighbors", () => {
    // Center cell (1,1) has 4 live neighbors: (0,0),(1,0),(2,0),(0,1) - dies from overpopulation
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]])).not.toContainEqual([1, 1]);
  });
  it("should keep a 2x2 block stable as a still life", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should transform a vertical blinker to a horizontal blinker", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});
