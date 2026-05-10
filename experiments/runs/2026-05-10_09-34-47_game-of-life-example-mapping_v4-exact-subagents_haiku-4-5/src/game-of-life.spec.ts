import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  // Rule 1: Underpopulation - Live cell with < 2 neighbors dies
  it("should kill a live cell with no neighbors", () => {
    // Single live cell at origin with no neighbors
    const grid: Array<[number, number]> = [[0, 0]];
    const result = nextGeneration(grid);
    // Cell should die from underpopulation
    expect(result).toEqual([]);
  });
  it("should kill a live cell with one neighbor", () => {
    // Two live cells at [0,0] and [1,0] - each has exactly one neighbor
    const grid: Array<[number, number]> = [[0, 0], [1, 0]];
    const result = nextGeneration(grid);
    // Both cells should die from underpopulation (< 2 neighbors)
    expect(result).toEqual([]);
  });

  // Rule 2: Survival - Live cell with 2-3 neighbors survives
  it("should keep a live cell alive with two neighbors", () => {
    // Three cells in a line: [0,0] [1,0] [2,0]
    // [1,0] (middle) has exactly 2 neighbors: [0,0] and [2,0]
    const grid: Array<[number, number]> = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(grid);
    // Middle cell should survive with 2 neighbors (Rule 2)
    // End cells should die with 1 neighbor each (Rule 1)
    // Dead cells [1,-1] and [1,1] each have 3 neighbors, so they are born
    // After next generation: middle survives, two new cells born (vertical blinker orientation)
    expect(result.sort()).toEqual([[1, -1], [1, 0], [1, 1]].sort());
  });
  it("should keep a live cell alive with three neighbors", () => {
    // Four cells forming a square or line with center having 3 neighbors
    // Example: [0,0] [1,0] [2,0] [1,1]
    // [1,0] has neighbors at [0,0], [2,0], [1,1] = 3 neighbors
    const grid: Array<[number, number]> = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(grid);
    // [1,0] should survive with 3 neighbors (Rule 2: Survival)
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
  });

  // Rule 3: Overpopulation - Live cell with > 3 neighbors dies
  it("should kill a live cell with four neighbors", () => {
    // Five cells: center cell [1,1] with four neighbors around it
    // [0,1], [1,0], [1,2], [2,1] form a + pattern around [1,1]
    const grid: Array<[number, number]> = [[1, 1], [0, 1], [1, 0], [1, 2], [2, 1]];
    const result = nextGeneration(grid);
    // Center cell [1,1] should die from overpopulation (4 neighbors > 3)
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  // Rule 4: Reproduction - Dead cell with exactly 3 neighbors becomes alive
  it("should create a new live cell with exactly three neighbors", () => {
    // Three cells: [0,0], [1,0], [2,0] in a horizontal line
    // The cell at [1,1] (directly above [1,0]) is dead but has exactly 3 neighbors:
    // [0,0], [1,0], [2,0] are all adjacent to [1,1]
    const grid: Array<[number, number]> = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(grid);
    // Dead cell [1,1] should become alive (Rule 4: Reproduction with exactly 3 neighbors)
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  // Empty grid
  it("should return empty grid when given empty grid", () => {
    const grid: Array<[number, number]> = [];
    const result = nextGeneration(grid);
    expect(result).toEqual([]);
  });

  // Single cell cases
  it.todo("should kill a lone live cell (no neighbors)");

  // Stable patterns
  it("should keep a block pattern stable", () => {
    // Block pattern: 2x2 square of live cells [[0,0], [0,1], [1,0], [1,1]]
    // Each cell in the block has exactly 3 neighbors (the other 3 cells)
    // Block pattern is stable - it should remain unchanged after one generation
    const grid: Array<[number, number]> = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const result = nextGeneration(grid);
    expect(result.sort()).toEqual(grid.sort());
  });

  // Oscillating patterns
  it("should oscillate a blinker pattern", () => {
    // Blinker pattern: 3 cells in a horizontal line [[0,0], [1,0], [2,0]]
    // After one generation, rotates to vertical: [[1,-1], [1,0], [1,1]]
    // This is a classic oscillator with period 2
    const grid: Array<[number, number]> = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(grid);
    // Expected result: vertical line at x=1: [[1,-1], [1,0], [1,1]]
    expect(result.sort()).toEqual([[1, -1], [1, 0], [1, 1]].sort());
  });

  // Negative coordinates
  it("should handle negative coordinates correctly", () => {
    // Create a pattern with negative coordinates: [-1,-1], [-1,0], [0,-1]
    // This tests that the algorithm handles negative x and y values correctly
    const grid: Array<[number, number]> = [[-1, -1], [-1, 0], [0, -1]];
    const result = nextGeneration(grid);
    // With 3 cells positioned around a point, the dead cell at [0,0] should have exactly 3 neighbors
    // and should be born (Rule 4: Reproduction)
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(true);
  });
});
