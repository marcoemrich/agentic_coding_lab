import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid when single live cell dies from underpopulation", () => {
    expect(nextGeneration([[true]])).toEqual([]);
  });
  it("should return empty grid when two live cells die from underpopulation", () => {
    expect(nextGeneration([[true, true]])).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors", () => {
    // A live cell at position [0][1] has 2 live neighbors: [0][0] and [0][2]
    expect(nextGeneration([[true, true, true]])).toEqual([[false, true, false]]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors", () => {
    // A 2x2 grid: all 4 cells live. Cell [0][0] has exactly 3 live neighbors: [0][1], [1][0], [1][1]
    expect(nextGeneration([[true, true], [true, true]])).toEqual([[true, true], [true, true]]);
  });
  it("should kill a live cell when it has more than 3 live neighbors", () => {
    // In a 2x3 all-live grid, the middle cells [0][1] and [1][1] each have 5 live neighbors (>3), so they die
    expect(nextGeneration([[true, true, true], [true, true, true]])).toEqual([[true, false, true], [true, false, true]]);
  });
  it.todo("should bring a dead cell to life when it has exactly 3 live neighbors");
  it.todo("should compute next generation for blinker pattern");
  it.todo("should compute next generation for block still life pattern");
});
