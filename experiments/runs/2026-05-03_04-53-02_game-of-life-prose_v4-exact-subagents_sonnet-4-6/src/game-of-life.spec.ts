import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return empty set for empty grid", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should return empty set for single living cell with no neighbors", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill a living cell with only one live neighbor", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0"]))).not.toContain("0,0");
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0"]))).not.toContain("2,0");
  });
  it("should keep a living cell alive with exactly two live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "1,1"]))).toContain("1,0");
  });
  it("should keep a living cell alive with exactly three live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "0,1", "1,1"]))).toContain("0,0");
  });
  it("should kill a living cell with four or more live neighbors", () => {
    // cell "1,1" has 4 live neighbors: "0,0", "1,0", "2,0", "0,1"
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0", "0,1", "1,1"]))).not.toContain("1,1");
  });
  it("should bring a dead cell to life when it has exactly three live neighbors", () => {
    // dead cell "1,1" has exactly three live neighbors: "0,0", "1,0", "2,0"
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0"]))).toContain("1,1");
  });
  it("should not bring a dead cell to life when it has fewer than three live neighbors", () => {
    // dead cell "1,1" has exactly two live neighbors: "0,0" and "1,0"
    expect(nextGeneration(new Set(["0,0", "1,0"]))).not.toContain("1,1");
  });
  it("should not bring a dead cell to life when it has more than three live neighbors", () => {
    // dead cell "1,1" has four live neighbors: "0,0", "1,0", "2,0", "0,1"
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0", "0,1"]))).not.toContain("1,1");
  });
  it("should handle a stable block pattern (2x2 square survives unchanged)", () => {
    const block = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(nextGeneration(block)).toEqual(block);
  });
});
