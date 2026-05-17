import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (2x2 square) stable across generations", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Pattern: ### / .#. / ###
    // Center (1,1) has 6 live neighbors → dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    // Center cell (1,1) should NOT be in result
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 live neighbors → born
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker shifted to negative coords: (-5,-5), (-5,-4), (-5,-3)
    // Becomes horizontal: (-6,-4), (-5,-4), (-4,-4)
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual(expected.sort());
  });
});
