import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty set when there are no living cells", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill a living cell with only one living neighbor (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("should keep a living cell alive with two living neighbors", () => {
    // Three cells in a row: (0,0), (1,0), (2,0)
    // Middle cell (1,0) has 2 neighbors: (0,0) and (2,0) -> stays alive
    // (0,0) has 1 neighbor -> dies
    // (2,0) has 1 neighbor -> dies
    // Dead cells (1,1) and (1,-1) each have 3 neighbors -> become alive
    expect(nextGeneration(new Set(["0,0", "1,0", "2,0"]))).toEqual(
      new Set(["1,0", "1,1", "1,-1"])
    );
  });
  it("should keep a living cell alive with three living neighbors", () => {
    // 2x2 block: each cell has exactly 3 living neighbors -> all stay alive
    // No dead cell has exactly 3 neighbors, so no new cells are born
    expect(nextGeneration(new Set(["0,0", "1,0", "0,1", "1,1"]))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should kill a living cell with four living neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) with four neighbors at (0,1), (2,1), (1,0), (1,2)
    // Center cell has exactly 4 living neighbors -> dies (overpopulation)
    const result = nextGeneration(new Set(["1,1", "0,1", "2,1", "1,0", "1,2"]));
    expect(result.has("1,1")).toBe(false);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors (reproduction)", () => {
    // Three cells in an L-shape: (0,0), (1,0), (0,1)
    // Dead cell (1,1) has 3 living neighbors: (0,0), (1,0), (0,1) -> becomes alive
    const result = nextGeneration(new Set(["0,0", "1,0", "0,1"]));
    expect(result.has("1,1")).toBe(true);
  });
  it("should not bring a dead cell to life when it has two living neighbors", () => {
    // Three cells in a row: (0,0), (1,0), (2,0)
    // Dead cell (2,1) has exactly 2 living neighbors: (1,0) and (2,0)
    // It should NOT become alive (reproduction requires exactly 3 neighbors)
    const result = nextGeneration(new Set(["0,0", "1,0", "2,0"]));
    expect(result.has("2,1")).toBe(false);
  });
  it("should handle living cells with negative coordinates", () => {
    // Three cells in a row at negative coordinates: (-2,-1), (-1,-1), (0,-1)
    // Middle cell (-1,-1) has 2 neighbors -> stays alive
    // (-2,-1) and (0,-1) each have 1 neighbor -> die
    // Dead cells (-1,0) and (-1,-2) each have 3 neighbors -> become alive
    expect(nextGeneration(new Set(["-2,-1", "-1,-1", "0,-1"]))).toEqual(
      new Set(["-1,-1", "-1,0", "-1,-2"])
    );
  });
});
