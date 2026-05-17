import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker (vertical to horizontal)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors → dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
      [1, 1],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has exactly 3 live neighbors → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Blinker centered at origin, all coordinates negative or zero
    const vertical: [number, number][] = [[-1, -1], [-1, 0], [-1, 1]];
    const horizontal: [number, number][] = [[-2, 0], [-1, 0], [0, 0]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
