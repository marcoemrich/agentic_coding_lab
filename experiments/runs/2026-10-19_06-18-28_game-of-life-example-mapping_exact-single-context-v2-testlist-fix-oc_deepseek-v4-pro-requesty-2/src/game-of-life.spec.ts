import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (Rule 1: underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells each with 1 neighbor (Rule 1: underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with 2 live neighbors (Rule 2: survival) -- block still life", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell alive with 3 live neighbors (Rule 2: survival)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 2], [0, 1]])).toEqual([[-1, 1], [0, 0], [0, 1], [1, 0]]);
  });
  it("should kill a live cell with 4 live neighbors (Rule 3: overpopulation)", () => {
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should make a dead cell alive with exactly 3 live neighbors (Rule 4: reproduction)", () => {
    expect(nextGeneration([[1, 0], [0, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should leave a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});