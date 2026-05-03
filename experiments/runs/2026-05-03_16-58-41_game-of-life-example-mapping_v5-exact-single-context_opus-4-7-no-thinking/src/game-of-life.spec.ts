import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block alive (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should transform vertical blinker into horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(expected.sort());
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center (1,1) is live with 4 live neighbors → dies
    const cells: [number, number][] = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // Dead cell (1,1) has live neighbors at (0,0),(1,0),(0,1) → exactly 3 → becomes alive
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Block at negative coordinates - should remain unchanged
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
});
