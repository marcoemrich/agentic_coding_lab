import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell", () => {
    expect(nextGeneration([[true]])).toEqual([]);
  });
  it("should return empty grid when all cells die from underpopulation", () => {
    expect(nextGeneration([[true, false], [false, false]])).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors", () => {
    // Middle cell of [true, true, true] has exactly 2 live neighbors (left and right)
    expect(nextGeneration([[true, true, true]])).toEqual([[true]]);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors", () => {
    // 2x2 grid of live cells: each cell has exactly 3 live neighbors
    expect(nextGeneration([[true, true], [true, true]])).toEqual([[true, true], [true, true]]);
  });
  it("should kill a live cell with more than 3 live neighbors", () => {
    // A live cell with 4 live neighbors (overpopulation) dies
    // Use a cross pattern: center has 4 live neighbors
    //   false true  false
    //   true  true  true
    //   false true  false
    // Center cell (1,1) has 4 live neighbors -> dies (overpopulation)
    // Edge cells (0,1),(1,0),(1,2),(2,1) each have 3 live neighbors within grid bounds -> survive
    // Corner cells (0,0),(0,2),(2,0),(2,2) each have 3 live neighbors -> come alive (reproduction)
    // Next gen:
    //   true  true  true
    //   true  false true
    //   true  true  true
    const result = nextGeneration([
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ]);
    expect(result).toEqual([
      [true, true, true],
      [true, false, true],
      [true, true, true],
    ]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors", () => {
    // L-shaped pattern: dead cell at (1,1) has exactly 3 live neighbors
    // true  true
    // true  false
    // Dead cell (1,1) neighbors: (0,0)=true, (0,1)=true, (1,0)=true -> 3 live neighbors -> comes alive
    expect(nextGeneration([[true, true], [true, false]])).toEqual([[true, true], [true, true]]);
  });
  it("should produce correct next generation for blinker pattern", () => {
    // Vertical blinker in 3x3 grid:
    // false true false
    // false true false
    // false true false
    // Next generation is horizontal blinker, cropped to 1x3:
    // true true true
    expect(nextGeneration([
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ])).toEqual([[true, true, true]]);
  });
  it("should produce correct next generation for block still life pattern", () => {
    // Block still life: 2x2 grid of live cells remains unchanged
    // Gen 0: [[true, true], [true, true]]
    // Gen 1: [[true, true], [true, true]]
    expect(nextGeneration([[true, true], [true, true]])).toEqual([[true, true], [true, true]]);
  });
});
