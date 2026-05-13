import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two isolated live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [10, 10]])).toEqual([]);
  });
  it("should apply blinker oscillation: three cells in a row becomes three cells in a column", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toEqual([[0, -1], [0, 0], [0, 1]]);
  });
  it("should keep a 2x2 block stable (all cells have exactly 3 neighbors)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should advance multiple steps correctly", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const step2 = nextGeneration(nextGeneration(horizontal));
    expect(step2).toEqual([[-1, 0], [0, 0], [1, 0]]);
  });
});
