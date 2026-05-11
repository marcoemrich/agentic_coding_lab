import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block alive unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(result)).toEqual(sortCells(block));
  });
  it("should let a live cell with 2 or 3 neighbors survive (survival)", () => {
    // L-shape: (1,1) has 3 live neighbors (0,0),(1,0),(2,0) → survives
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(input);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Expected next generation:
    // (1,1) alive, 3 neighbors → survives
    // (0,0) alive, 2 neighbors → survives
    // (1,0) alive, 3 neighbors → survives
    // (2,0) alive, 2 neighbors → survives
    // (0,1) dead, 3 neighbors → born
    // (2,1) dead, 3 neighbors → born
    // (1,-1) dead, 3 neighbors → born
    const expected: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, -1],
    ];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // 3x3 filled block - center (1,1) has 8 neighbors → dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Expected: corners survive, edges die (5 neighbors each), center dies (8 neighbors)
    // 4 dead cells outside the block come alive (3 neighbors each)
    const expected: [number, number][] = [
      [0, 0], [2, 0], [0, 2], [2, 2],
      [-1, 1], [3, 1], [1, -1], [1, 3],
    ];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // Gen 0: L-shape at top-left corner of 3x3 (y-up):
    //   row 2: ##.   → (0,2),(1,2)
    //   row 1: #..   → (0,1)
    //   row 0: ...
    const input: [number, number][] = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(input);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Expected Gen 1: dead (1,1) has 3 live neighbors → born; the 3 live cells survive (2 neighbors each)
    const expected: [number, number][] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    // Gen 0: vertical blinker at (0,0),(0,1),(0,2)
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(input);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Gen 1: horizontal blinker at (-1,1),(0,1),(1,1)
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
  it("should handle negative coordinates", () => {
    // Gen 0: blinker at (-5,-5),(-5,-4),(-5,-3)
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(input);
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Gen 1: horizontal blinker at (-6,-4),(-5,-4),(-4,-4)
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
});
