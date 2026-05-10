import { describe, it, expect } from "vitest";
import { nextGeneration, nextGenerationSparse, type Grid } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single live cell (underpopulation)", () => {
    // Grid: 3x3, center cell (1,1) is alive, no neighbors
    const grid: Grid = [
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell should be dead - it has 0 neighbors (underpopulation)
    expect(result).toEqual([
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
  });
  it("should kill live cell with one neighbor (underpopulation)", () => {
    // Grid: 3x3, center cell (1,1) is alive, only cell (1,2) is alive
    const grid: Grid = [
      [false, false, false],
      [true, true, false],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Both cells should be dead - center has 1 neighbor (underpopulation)
    expect(result).toEqual([
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
  });
  it("should keep live cell alive with 2 neighbors (survival)", () => {
    // Grid: 3x3, center cell (1,1) is alive with 2 neighbors
    const grid: Grid = [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell should stay alive (2 neighbors = survival)
    expect(result).toEqual([
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ]);
  });
  it("should keep live cell with three neighbors (survival)", () => {
    // Grid: 3x3, center cell (1,1) is alive with 2 neighbors
    const grid: Grid = [
      [false, true, false],
      [true, true, false],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell should stay alive (2 neighbors = survival)
    // (0,0) should be born (3 neighbors = reproduction)
    expect(result).toEqual([
      [true, true, false],
      [true, true, false],
      [false, false, false],
    ]);
  });
  it("should kill live cell with four neighbors (overpopulation)", () => {
    // Grid: 3x3, center cell (1,1) is alive with 3 neighbors
    const grid: Grid = [
      [true, false, true],
      [true, true, false],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell should survive (3 neighbors = survival)
    // (0,2) should die (1 neighbor = underpopulation)
    expect(result).toEqual([
      [true, false, false],
      [true, true, false],
      [false, false, false],
    ]);
  });
  it("should revive dead cell with exactly 3 neighbors (reproduction)", () => {
    // Grid: 3x3, center cell (1,1) is dead with 3 neighbors
    const grid: Grid = [
      [false, true, false],
      [true, false, true],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell should be alive (dead cell with 3 neighbors = reproduction)
    // (1,0) should die (1 neighbor = underpopulation)
    // (1,2) should die (1 neighbor = underpopulation)
    expect(result).toEqual([
      [false, true, false],
      [false, true, false],
      [false, false, false],
    ]);
  });
  it("should not revive dead cell with two neighbors", () => {
    // Grid: 3x3, center cell (1,1) is dead with 2 neighbors
    const grid: Grid = [
      [false, false, false],
      [true, false, true],
      [false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell should stay dead (dead cell with 2 neighbors = no reproduction)
    expect(result).toEqual([
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
  });
  it("should not revive dead cell with four neighbors", () => {
    // Grid: 5x5, center cell (2,2) is dead with exactly 4 neighbors
    // Only the 4 corner neighbors of center are alive, all others dead
    const grid: Grid = [
      [false, false, false, false, false],
      [false, true, false, true, false],
      [false, false, false, false, false],
      [false, true, false, true, false],
      [false, false, false, false, false],
    ];
    const result = nextGeneration(grid);
    // Center cell (2,2) should stay dead (dead cell with 4 neighbors = no reproduction)
    // The 4 neighbors each have 2 neighbors (not 2 or 3 alive neighbors for survival)
    // so they should all die too
    expect(result).toEqual([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]);
  });
  it("should apply rules to multiple cells simultaneously", () => {
    // Grid: 5x5 with multiple live cells that need different rule applications
    // Live cells at (1,1), (1,2), (3,2), (3,3)
    const grid: Grid = [
      [false, false, false, false, false],
      [false, true, true, false, false],
      [false, false, false, false, false],
      [false, false, true, true, false],
      [false, false, false, false, false],
    ];
    const result = nextGeneration(grid);
    // (1,1) has 1 neighbor -> dies
    // (1,2) has 1 neighbor -> dies
    // (3,2) has 1 neighbor -> dies
    // (3,3) has 1 neighbor -> dies
    // (2,1) has 3 neighbors -> born
    // (2,3) has 3 neighbors -> born
    expect(result).toEqual([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, true, false, true, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]);
  });
  it("should work with negative coordinates", () => {
    // Test sparse grid representation with coordinate keys
    // This allows negative coordinates: Map<string, boolean>
    // Expected format: "row,col" => boolean
    const sparseGrid = new Map<string, boolean>();
    sparseGrid.set("-1,-1", false);
    sparseGrid.set("-1,0", false);
    sparseGrid.set("-1,1", false);
    sparseGrid.set("0,-1", false);
    sparseGrid.set("0,0", true);
    sparseGrid.set("0,1", false);
    sparseGrid.set("1,-1", false);
    sparseGrid.set("1,0", false);
    sparseGrid.set("1,1", false);

    const result = nextGenerationSparse(sparseGrid);
    // Single live cell with 0 neighbors should die
    expect(result.get("0,0")).toBe(false);
  });
  it("should handle blinker pattern oscillation", () => {
    // Blinker: A period-2 oscillator
    // Gen 0: vertical arrangement
    const gen0: Grid = [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ];

    // Gen 1: should be horizontal arrangement
    const gen1 = nextGeneration(gen0);
    const expected1: Grid = [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ];
    expect(gen1).toEqual(expected1);

    // Gen 2: should return to Gen 0 (horizontal to vertical)
    const gen2 = nextGeneration(gen1);
    expect(gen2).toEqual(gen0);
  });
  it("should correctly evolve block pattern", () => {
    // Block pattern: 2x2 square of live cells - should remain stable (period-1)
    const block: Grid = [
      [true, true],
      [true, true],
    ];
    const result = nextGeneration(block);
    // Each cell has exactly 3 neighbors, so all should survive
    expect(result).toEqual([
      [true, true],
      [true, true],
    ]);
  });
});
