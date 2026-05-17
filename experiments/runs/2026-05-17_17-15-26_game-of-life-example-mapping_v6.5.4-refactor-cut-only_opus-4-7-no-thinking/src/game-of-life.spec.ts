import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with only 1 neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    // Vertical blinker: middle cell (0,1) has 2 neighbors, survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // 3x3 filled: center (1,1) has 8 neighbors → dies
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors → comes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should preserve a block still life across a generation", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
  it("should handle negative coordinates correctly", () => {
    // Block at negative coords — should remain stable
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
});
