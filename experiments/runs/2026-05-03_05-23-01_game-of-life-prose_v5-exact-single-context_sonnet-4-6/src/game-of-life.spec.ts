import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty set when given empty set", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should return empty set when single cell has no neighbors", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should return empty set when cell has only one live neighbor", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("should keep a cell alive when it has exactly two live neighbors", () => {
    // horizontal blinker: middle cell has 2 neighbors → survives; ends die; verticals born
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0"]))).toEqual(new Set(["1,-1", "1,0", "1,1"]));
  });
  it("should keep a cell alive when it has exactly three live neighbors", () => {
    // 2x2 block: each cell has exactly 3 live neighbors → all survive (stable)
    const block = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should kill a cell with more than three live neighbors", () => {
    // plus sign: center has 4 live neighbors → dies; arms survive; diagonal dead cells born
    const plus = new Set(["1,0", "0,1", "1,1", "2,1", "1,2"]);
    expect(nextGeneration(plus)).toEqual(new Set(["1,0", "0,1", "2,1", "1,2", "0,0", "2,0", "0,2", "2,2"]));
  });
  it("should bring a dead cell to life when it has exactly three live neighbors", () => {
    // L-shape: dead cell "1,1" has 3 live neighbors → born; all three living cells survive
    expect(nextGeneration(new Set(["0,0", "1,0", "0,1"]))).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
});
