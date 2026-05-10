import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single live cell (underpopulation)", () => {
    const liveCells = [[0, 0]];
    expect(nextGeneration(liveCells)).toEqual([]);
  });
  it("should keep live cell with two neighbors (survival)", () => {
    const liveCells = [[1, 1], [0, 0], [0, 1]];
    expect(nextGeneration(liveCells)).toEqual([[1, 1]]);
  });
  it("should keep live cell with three neighbors (survival)", () => {
    const liveCells = [[1, 1], [1, 2], [0, 1], [2, 1]];
    expect(nextGeneration(liveCells)).toEqual([[1, 1]]);
  });
  it("should kill live cell with four neighbors (overpopulation)", () => {
    const liveCells = [[1, 1], [0, 1], [1, 0], [2, 1], [1, 2]];
    expect(nextGeneration(liveCells)).toEqual([]);
  });
  it("should revive dead cell with exactly three neighbors (reproduction)", () => {
    const liveCells = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(liveCells)).toEqual([[1, 1]]);
  });
  it("should handle blinker pattern (period 2)", () => {
    // Vertical blinker
    const verticalBlinker = [[0, 0], [1, 0], [2, 0]];
    const nextGen = nextGeneration(verticalBlinker);
    // Should become horizontal: three cells in a row turn to three cells in a column
    expect(nextGen).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should handle block pattern (stable)", () => {
    // Block pattern: 2x2 stable configuration
    const blockPattern = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(nextGeneration(blockPattern)).toEqual(blockPattern);
  });
  it("should handle multiple independent patterns", () => {
    // Two independent block patterns at different locations
    const pattern1 = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const pattern2 = [[5, 5], [5, 6], [6, 5], [6, 6]];
    const liveCells = [...pattern1, ...pattern2];

    // Both stable block patterns should remain unchanged
    expect(nextGeneration(liveCells)).toEqual(liveCells);
  });
  it("should support negative coordinates", () => {
    const liveCells = [[-1, -1], [-1, 0], [0, -1]];
    expect(nextGeneration(liveCells)).toEqual([[0, 0]]);
  });
});
