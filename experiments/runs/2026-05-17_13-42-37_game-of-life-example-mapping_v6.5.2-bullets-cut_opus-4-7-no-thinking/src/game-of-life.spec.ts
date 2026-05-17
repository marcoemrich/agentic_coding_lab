import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (both have only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a 2x2 block stable (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should bring a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    // L-shape: (0,1) (1,1) (0,0) — dead cell (1,0) has 3 live neighbors
    const input: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // 3x3 filled square — center (1,1) has 8 live neighbors
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker shifted to negative region: cells at (-5,-5), (-5,-4), (-5,-3)
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual(expected.sort());
  });
});
