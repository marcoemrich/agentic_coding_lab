import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when given no alive cells", () => {
    expect(nextGeneration([], 1)).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a cell alive that has exactly two neighbors", () => {
    // Horizontal blinker: center cell [1,0] has exactly 2 neighbors
    // [1,0] survives; [0,0] and [2,0] die; [1,-1] and [1,1] are born
    const blinker = [[0, 0], [1, 0], [2, 0]];
    expect(nextGeneration(blinker, 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive that has exactly three neighbors", () => {
    // 2x2 block: each cell has exactly 3 neighbors, stable still life
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    // Plus/cross: center [1,1] has 4 neighbors → dies
    const plus = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = nextGeneration(plus, 1);
    // Center should be dead (not in result)
    expect(result).not.toContainEqual([1, 1]);
    // Full expected: ring pattern
    expect(result).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should bring a dead cell to life when it has exactly three neighbors (reproduction)", () => {
    // L-shape: dead cell [1,1] has exactly 3 alive neighbors → born
    const lShape = [[0, 0], [0, 1], [1, 0]];
    const result = nextGeneration(lShape, 1);
    expect(result).toContainEqual([1, 1]);
    // Full result: L-shape becomes a 2x2 block
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should advance multiple steps when steps > 1", () => {
    // Blinker has period 2: after 2 steps it returns to original (sorted)
    const blinker = [[0, 0], [1, 0], [2, 0]];
    expect(nextGeneration(blinker, 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should sort output lexicographically by x then y", () => {
    // steps=0 returns input unchanged — but output must still be sorted
    expect(nextGeneration([[1, 0], [0, 0]], 0)).toEqual([[0, 0], [1, 0]]);
    // Also verify with negative coordinates
    expect(nextGeneration([[0, 0], [-1, 0]], 0)).toEqual([[-1, 0], [0, 0]]);
  });
});
