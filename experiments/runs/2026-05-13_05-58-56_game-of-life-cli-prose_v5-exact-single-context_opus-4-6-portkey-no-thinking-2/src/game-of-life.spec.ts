import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid with zero steps", () => {
    expect(nextGeneration([], 0)).toEqual([]);
  });
  it("should return the same cells when steps is zero", () => {
    expect(nextGeneration([[1, 1], [2, 2]], 0)).toEqual([[1, 1], [2, 2]]);
  });
  it("should kill a single cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a cell alive that has exactly two live neighbors", () => {
    // Horizontal blinker: middle cell [1,0] has 2 neighbors and survives
    // End cells die, but [1,-1] and [1,1] are born by reproduction
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive that has exactly three live neighbors", () => {
    // 2x2 block: each cell has exactly 3 neighbors, all survive (still life)
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell that has more than three live neighbors", () => {
    // Plus/cross pattern: center [1,1] has 4 neighbors → dies (overpopulation)
    // Arms each have 3 neighbors → survive; corners are born
    // Result: center dies, arms survive, 4 corners born = 8 cells
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], 1);
    // Verify center [1,1] is NOT in the result (overpopulation)
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors", () => {
    // L-shape: [1,1] is dead with 3 live neighbors → born (becomes a block)
    expect(nextGeneration([[0, 0], [0, 1], [1, 0]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    // Vertical blinker (input unsorted) → horizontal blinker (output must be sorted)
    expect(nextGeneration([[1, 2], [1, 0], [1, 1]], 1)).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
  it("should apply rules for multiple generations", () => {
    // Blinker with period 2: after 2 steps returns to original configuration
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]], 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should handle negative coordinates", () => {
    // Blinker at negative coordinates: horizontal → vertical
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]], 1)).toEqual([[0, -1], [0, 0], [0, 1]]);
  });
});
