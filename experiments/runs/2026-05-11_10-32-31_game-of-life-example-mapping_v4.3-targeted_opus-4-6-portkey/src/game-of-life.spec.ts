import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    // Three cells in a horizontal line - center cell (1,0) has exactly 2 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    // Center cell (1,0) survives with 2 neighbors
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    // Cell (1,0) has exactly 3 neighbors: (0,0), (2,0), (1,1)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with 4 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors → dies
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // Dead cell (1,1) has exactly 3 live neighbors: (0,0), (1,0), (0,1) → born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a blinker pattern (horizontal to vertical)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const expectedHorizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expectedHorizontal));
  });
});
