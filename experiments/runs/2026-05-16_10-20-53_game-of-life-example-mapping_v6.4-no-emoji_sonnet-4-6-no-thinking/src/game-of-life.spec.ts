import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    // Three cells in a row: (0,0), (1,0), (2,0)
    // Middle cell (1,0) has 2 neighbors → survives
    // End cells (0,0) and (2,0) each have 1 neighbor → die
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, 0]]);
  });
  it("should keep a live cell alive when it has 3 live neighbors (survival)", () => {
    // Block: (0,0),(1,0),(0,1) are live; (1,1) is dead with 3 neighbors
    // (0,0) has neighbors (1,0),(0,1) → 2 neighbors → survives
    // (1,0) has neighbors (0,0),(0,1) → 2 neighbors → survives
    // (0,1) has neighbors (0,0),(1,0) → 2 neighbors → survives
    // Use a different arrangement: L-shape where center has 3 live neighbors
    // (0,0),(1,0),(2,0),(1,1): (1,0) has neighbors (0,0),(2,0),(1,1) → 3 → survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) surrounded by 4 neighbors: (0,1),(2,1),(1,0),(1,2)
    // (1,1) has 4 neighbors → dies (overpopulation)
    const result = nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2], [1, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it.todo("should resurrect a dead cell with exactly 3 live neighbors (reproduction)");
  it.todo("should correctly compute the blinker oscillator pattern (integration)");
  it.todo("should correctly compute the block still-life pattern (integration)");
});
