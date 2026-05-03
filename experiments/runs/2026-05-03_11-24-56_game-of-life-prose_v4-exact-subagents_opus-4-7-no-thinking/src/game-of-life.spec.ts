import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return an empty set when given an empty set of living cells", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should return an empty set when a single living cell has no neighbors (underpopulation)", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("should kill a living cell with only one live neighbor (underpopulation)", () => {
    // Three cells: (5,5) has 1 neighbor -> dies; (5,5)'s only neighbor (6,5) has 2 neighbors;
    // Use simpler isolated pair: two diagonal cells far from anything else with 1 neighbor each
    // To force non-trivial failure, add a known stable 2x2 block far away that survives
    const input = new Set(["0,0", "1,0", "10,10", "11,10", "10,11", "11,11"]);
    const expected = new Set(["10,10", "11,10", "10,11", "11,11"]);
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should keep a living cell alive when it has two live neighbors (survival)", () => {
    // A vertical line of 3 cells (blinker): middle cell has 2 live neighbors, survives
    // The two end cells have 1 neighbor each, so they die.
    // The two horizontal cells (left and right of middle) each have 3 live neighbors, become alive.
    // To isolate the survival rule, we need to construct a scenario where a living cell with
    // exactly 2 neighbors survives. Use an L-shape: (0,0), (1,0), (0,1) where (0,0) has 2 neighbors.
    // (0,0) -> 2 neighbors (1,0) and (0,1) -> survives
    // (1,0) -> 1 neighbor (0,0) -> dies
    // (0,1) -> 1 neighbor (0,0) -> dies
    // (1,1) dead -> 3 neighbors (0,0), (1,0), (0,1) -> becomes alive
    // So result includes (0,0) which is the survival case
    const input = new Set(["0,0", "1,0", "0,1"]);
    const result = nextGeneration(input);
    expect(result.has("0,0")).toBe(true);
  });
  it("should keep a living cell alive when it has three live neighbors (survival)", () => {
    // A 2x2 block: each cell has 3 live neighbors -> all survive
    // (0,0) has neighbors (1,0), (0,1), (1,1) -> 3 live neighbors -> survives
    const input = new Set(["0,0", "1,0", "0,1", "1,1"]);
    const result = nextGeneration(input);
    expect(result.has("0,0")).toBe(true);
  });
  it("should kill a living cell with four live neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors at the corners (0,0), (2,0), (0,2), (2,2)
    // (1,1) should die from overpopulation
    // The four corners each have only 1 live neighbor (1,1), so they die from underpopulation
    // The four edge-middle dead cells (1,0), (0,1), (2,1), (1,2) each have 3 live neighbors -> reproduce
    const input = new Set(["1,1", "0,0", "2,0", "0,2", "2,2"]);
    const expected = new Set(["1,0", "0,1", "2,1", "1,2"]);
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    // Dead cell (1,1) has three live neighbors: (0,0), (1,0), (0,1)
    // (1,1) should become alive via reproduction
    const input = new Set(["0,0", "1,0", "0,1"]);
    const result = nextGeneration(input);
    expect(result.has("1,1")).toBe(true);
  });
  it("should handle living cells with negative coordinates", () => {
    // A 2x2 block at negative coordinates is stable - all four cells have 3 live neighbors and survive
    const input = new Set(["-1,-1", "0,-1", "-1,0", "0,0"]);
    const expected = new Set(["-1,-1", "0,-1", "-1,0", "0,0"]);
    expect(nextGeneration(input)).toEqual(expected);
  });
});
