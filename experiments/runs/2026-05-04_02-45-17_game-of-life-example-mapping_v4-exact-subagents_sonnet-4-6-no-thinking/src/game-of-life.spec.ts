import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[1]])).toEqual([]);
  });
  it("should return empty grid when two cells die from underpopulation", () => {
    expect(nextGeneration([[1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    // Horizontal blinker [[1,1,1]]: middle cell survives with 2 neighbors,
    // edge cells die, but dead cells above/below middle are born (3 neighbors each)
    // Result is vertical blinker [[1],[1],[1]]
    expect(nextGeneration([[1, 1, 1]])).toEqual([[1], [1], [1]]);
  });
  it("should keep a live cell alive when it has 3 live neighbors (survival)", () => {
    // In a 2x2 grid of all live cells, each cell has exactly 3 live neighbors, so all survive
    expect(nextGeneration([[1, 1], [1, 1]])).toEqual([[1, 1], [1, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // [[1,1,1],[1,1,1]]: center cells (0,1) and (1,1) each have 5 neighbors -> die
    // Dead cells above/below the center column are born (3 neighbors each)
    expect(nextGeneration([[1, 1, 1], [1, 1, 1]])).toEqual([[0, 1, 0], [1, 0, 1], [1, 0, 1], [0, 1, 0]]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Dead cell at (1,1) has 3 live neighbors: (0,0), (0,1), (1,0) -> comes alive
    // All three live cells each have exactly 2 live neighbors -> survive
    expect(nextGeneration([[1, 1], [1, 0]])).toEqual([[1, 1], [1, 1]]);
  });
  it("should compute next generation for the block (still life)", () => {
    // The block is a 2x2 grid of live cells - a still life pattern that never changes
    expect(nextGeneration([[1, 1], [1, 1]])).toEqual([[1, 1], [1, 1]]);
  });
  it("should compute next generation for the blinker (oscillator, first step)", () => {
    // Blinker: horizontal [[1,1,1]] -> vertical [[1],[1],[1]]
    expect(nextGeneration([[1, 1, 1]])).toEqual([[1], [1], [1]]);
  });
  it("should compute next generation for the blinker (oscillator, second step)", () => {
    // Blinker: vertical [[1],[1],[1]] -> horizontal [[1,1,1]]
    expect(nextGeneration([[1], [1], [1]])).toEqual([[1, 1, 1]]);
  });
});
