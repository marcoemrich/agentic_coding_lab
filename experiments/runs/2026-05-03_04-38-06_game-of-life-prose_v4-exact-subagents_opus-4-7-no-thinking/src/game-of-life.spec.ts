// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return an empty set when no cells are alive", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill a living cell with only one neighbor (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("should keep a living cell alive when it has two live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0"]))).toEqual(new Set(["1,0", "1,1", "1,-1"]));
  });
  it("should keep a living cell alive when it has three live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "0,1", "1,1"]))).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("should kill a living cell with more than three live neighbors (overpopulation)", () => {
    const result = nextGeneration(new Set(["0,0", "1,0", "-1,0", "0,1", "0,-1"]));
    expect(result.has("0,0")).toBe(false);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    // L-shape: cells at (0,0), (1,0), (0,1). Dead cell (1,1) has exactly 3 live neighbors.
    const result = nextGeneration(new Set(["0,0", "1,0", "0,1"]));
    expect(result.has("1,1")).toBe(true);
  });
  it("should handle cells with negative coordinates", () => {
    // Blinker at negative coordinates: vertical line at (-1,-1), (-1,0), (-1,1)
    // Should become horizontal line at (-2,0), (-1,0), (0,0)
    expect(nextGeneration(new Set(["-1,-1", "-1,0", "-1,1"]))).toEqual(new Set(["-2,0", "-1,0", "0,0"]));
  });
});
