import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single living cell (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two living cells (underpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).toEqual([]);
  });
  it("should transform vertical blinker to horizontal blinker", () => {
    // Vertical blinker: Gen 0 = [[0, 0], [0, 1], [0, 2]]
    // Gen 1 = [[-1, 1], [0, 1], [1, 1]] (horizontal)
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should keep a 2x2 block alive (still life)", () => {
    // 2x2 block: [[0,0], [1,0], [0,1], [1,1]]
    // Each cell has 3 neighbors, so all survive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should kill center cell with 4 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 neighbors, so dies
    // Gen 0: [[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2]]
    // Gen 1: [[0,0], [2,0], [0,2], [2,2]] (corners survive, center dies)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).toEqual([[0, 0], [2, 0], [0, 2], [2, 2]]);
  });
  it("should create a living cell with exactly 3 neighbors (reproduction)", () => {
    // Dead cell (1,1) has exactly 3 neighbors at (0,0), (1,0), (0,1)
    // So it should be born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker with negative coordinates
    // Gen 0: [[-1, -1], [-1, 0], [-1, 1]]
    // Gen 1: [[-2, 0], [-1, 0], [0, 0]] (horizontal)
    const result = nextGeneration([[-1, -1], [-1, 0], [-1, 1]]);
    expect(result).toEqual([[-2, 0], [-1, 0], [0, 0]]);
  });
});
