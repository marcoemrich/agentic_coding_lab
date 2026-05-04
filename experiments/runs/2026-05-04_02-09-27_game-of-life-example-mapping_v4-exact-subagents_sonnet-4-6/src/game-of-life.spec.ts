import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block of four cells alive (still life)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should transform a vertical blinker to a horizontal blinker", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should revive a dead cell with exactly 3 live neighbors (reproduction)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors: (0,0),(1,0),(2,0),(0,1)
    // With 4 neighbors, (1,1) should die from overpopulation
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]);
    expect(result).not.toContain([1, 1]);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
});
