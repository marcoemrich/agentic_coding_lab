import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return empty set when given empty set", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill cells with only one live neighbor (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("should keep alive a cell with two live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "0,1", "0,2"]))).toEqual(
      new Set(["0,1", "-1,1", "1,1"]),
    );
  });
  it("should keep alive a cell with three live neighbors", () => {
    expect(nextGeneration(new Set(["0,0", "0,1", "1,0", "1,1"]))).toEqual(
      new Set(["0,0", "0,1", "1,0", "1,1"]),
    );
  });
  it("should kill a cell with four live neighbors (overpopulation)", () => {
    expect(
      nextGeneration(new Set(["1,1", "0,1", "2,1", "1,0", "1,2"])),
    ).toEqual(new Set(["0,1", "2,1", "1,0", "1,2", "0,0", "2,0", "0,2", "2,2"]));
  });
  it("should bring to life a dead cell with exactly three live neighbors (reproduction)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0", "0,1"]))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("should handle cells with negative coordinates", () => {
    expect(nextGeneration(new Set(["-1,-1", "-1,0", "-1,1"]))).toEqual(
      new Set(["-2,0", "-1,0", "0,0"]),
    );
  });
});
