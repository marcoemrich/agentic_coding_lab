import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with 2 neighbors (survival)", () => {
    // Horizontal line of 3 cells: the middle cell (1,0) has 2 neighbors and survives.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // (1,1) has 4 live neighbors: (0,0), (1,0), (0,1), (2,1) -> dies
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // Dead cell (1,1) has 3 live neighbors: (0,0), (1,0), (0,1) -> becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("should preserve a block (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker at negative coords -> horizontal blinker
    const result = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    expect(result).toEqual(expect.arrayContaining([[-11, -9], [-10, -9], [-9, -9]]));
    expect(result).toHaveLength(3);
  });
});
