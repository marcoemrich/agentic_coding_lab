import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    // Vertical line of 3 cells - center cell (0,1) has 2 live neighbors and survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors at the corners, so it dies
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Dead cell at (1,1) has 3 live neighbors: (0,0), (1,0), (0,1) → becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should handle negative coordinates", () => {
    // Blinker at negative coordinates: vertical line at x=-5
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual([[-6, -4], [-5, -4], [-4, -4]].sort());
  });
});
