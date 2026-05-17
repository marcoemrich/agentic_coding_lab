import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.slice().sort()).toEqual(expected.slice().sort());
  });
  it("should birth a new cell when a dead cell has exactly 3 live neighbors", () => {
    // L-shape: ##  -> after one gen, dead cell (1,0) has 3 neighbors and is born
    //          #.
    const lShape: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(lShape);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) plus 4 diagonals = 4 neighbors → dies
    const pattern: [number, number][] = [
      [0, 0], [2, 0],
      [1, 1],
      [0, 2], [2, 2],
    ];
    const result = nextGeneration(pattern);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Block at negative coordinates should remain a still life
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(block);
    expect(result.slice().sort()).toEqual(block.slice().sort());
  });
});
