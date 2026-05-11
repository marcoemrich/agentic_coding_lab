import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep alive a cell with exactly two neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    // Three horizontal cells: (0,0), (1,0), (2,0)
    // Dead cells (1,1) and (1,-1) each have exactly 3 live neighbors → born
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const sorted = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should kill a live cell with more than three neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 neighbors → dies
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    const sorted = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should produce correct next generation for a blinker (oscillator)", () => {
    // Vertical blinker → horizontal blinker
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sorted = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});
