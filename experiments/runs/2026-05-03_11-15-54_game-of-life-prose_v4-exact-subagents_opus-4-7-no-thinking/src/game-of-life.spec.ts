import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return an empty set when given an empty set of living cells", () => {
    expect(nextGeneration(new Set<string>())).toEqual(new Set<string>());
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration(new Set<string>(["0,0"]))).toEqual(new Set<string>());
  });
  it("should kill a living cell with only one live neighbor (underpopulation)", () => {
    expect(nextGeneration(new Set<string>(["0,0", "1,0"]))).toEqual(new Set<string>());
  });
  it("should keep a living cell alive with two live neighbors (survival)", () => {
    expect(nextGeneration(new Set<string>(["0,0", "1,0", "2,0"]))).toContain("1,0");
  });
  it("should keep a living cell alive with three live neighbors (survival)", () => {
    expect(nextGeneration(new Set<string>(["0,0", "1,0", "0,1", "1,1"]))).toContain("0,0");
  });
  it("should kill a living cell with four live neighbors (overpopulation)", () => {
    expect(nextGeneration(new Set<string>(["1,1", "0,0", "2,0", "0,2", "2,2"]))).not.toContain("1,1");
  });
  it("should bring a dead cell to life with exactly three live neighbors (reproduction)", () => {
    expect(nextGeneration(new Set<string>(["0,0", "1,0", "2,0"]))).toContain("1,1");
  });
  it("should handle living cells with negative coordinates", () => {
    expect(nextGeneration(new Set<string>(["-1,0", "0,0", "1,0"]))).toEqual(
      new Set<string>(["0,0", "0,-1", "0,1"]),
    );
  });
});
