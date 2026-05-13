import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two live cells with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [5, 5]])).toEqual([]);
  });
  it("should evolve three cells in a line (blinker one step)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a 2x2 block stable (still life)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should return output cells sorted lexicographically by x then y", () => {
    expect(nextGeneration([[2, 0], [1, 0], [0, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
});
