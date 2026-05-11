import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const keys = result.map(c => c.join(","));
    expect(keys).toContain("1,0");
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    const keys = result.map(c => c.join(","));
    expect(keys).toContain("1,0");
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Plus/cross shape: (1,1) has 4 live neighbors -> dies
    const liveCells: number[][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(liveCells);
    const keys = result.map(c => c.join(","));
    expect(keys).not.toContain("1,1");
  });
  it("should produce a block still life from a block pattern", () => {
    const block: number[][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("should produce correct next generation for a blinker oscillator", () => {
    const blinkerGen0: number[][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerGen0);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["-1,1", "0,1", "1,1"]);
  });
});
