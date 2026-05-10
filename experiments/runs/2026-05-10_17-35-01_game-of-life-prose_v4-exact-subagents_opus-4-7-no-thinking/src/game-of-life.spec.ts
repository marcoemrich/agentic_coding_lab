import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty set when there are no living cells", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill a live cell with only one live neighbor (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("should keep a live cell alive with two live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "-1,0"]))).toContain("0,0");
  });
  it("should keep a live cell alive with three live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "-1,0", "0,1"]))).toContain("0,0");
  });
  it("should kill a live cell with four live neighbors (overpopulation)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "-1,0", "0,1", "0,-1"]))).not.toContain("0,0");
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    expect(nextGeneration(new Set(["0,0", "2,0", "1,1"]))).toContain("1,0");
  });
  it("should handle living cells at negative coordinates", () => {
    expect(nextGeneration(new Set(["-1,-1", "-2,-1", "-1,-2"]))).toContain("-2,-2");
  });
});
