import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty set when no cells are alive", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill two adjacent live cells (each has only one neighbor)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has exactly 3 live neighbors
    // All three live cells each have 2 neighbors, so they survive.
    // Result: a 2x2 block.
    const next = nextGeneration(new Set(["0,0", "1,0", "0,1"]));
    expect(next).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("should keep a live cell alive when it has exactly two live neighbors", () => {
    // Diagonal: (0,0), (1,1), (2,2). Middle (1,1) has 2 diagonal neighbors → survives.
    // Corners each have 1 neighbor → die. No dead cell has 3 neighbors.
    expect(nextGeneration(new Set(["0,0", "1,1", "2,2"]))).toEqual(new Set(["1,1"]));
  });
  it("should kill a live cell with four or more live neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 live neighbors → dies of overpopulation.
    const next = nextGeneration(new Set(["1,1", "0,1", "2,1", "1,0", "1,2"]));
    expect(next.has("1,1")).toBe(false);
  });
  it("should keep a 2x2 block stable across generations", () => {
    const block = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should oscillate a horizontal blinker into a vertical blinker", () => {
    const horizontal = new Set(["0,0", "1,0", "2,0"]);
    const vertical = new Set(["1,-1", "1,0", "1,1"]);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
  it("should handle cells with negative coordinates", () => {
    // Horizontal blinker centered at (-10, -10) → vertical blinker.
    const horizontal = new Set(["-11,-10", "-10,-10", "-9,-10"]);
    const vertical = new Set(["-10,-11", "-10,-10", "-10,-9"]);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
});
