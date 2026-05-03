import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged as a still life", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(expected.sort());
  });
  it("should kill a live cell with 4 or more neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors at corners → dies
    const gen0: Array<[number, number]> = [
      [0, 0], [2, 0],
      [1, 1],
      [0, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors at (0,0), (1,0), (0,1)
    const gen0: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Blinker at negative coords: vertical at x=-10 → horizontal at y=-9
    const vertical: Array<[number, number]> = [[-10, -10], [-10, -9], [-10, -8]];
    const expected: Array<[number, number]> = [[-11, -9], [-10, -9], [-9, -9]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(expected.sort());
  });
});
