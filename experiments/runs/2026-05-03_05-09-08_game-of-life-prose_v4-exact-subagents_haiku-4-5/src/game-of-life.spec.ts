import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return empty set for empty grid", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill single living cell (underpopulation)", () => {
    const grid = new Set<[number, number]>([
      [0, 0]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });
  it("should kill living cell with one neighbor (underpopulation)", () => {
    const grid = new Set<[number, number]>([
      [0, 0],
      [1, 0]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });
  it("should keep living cell with two neighbors", () => {
    const grid = new Set<[number, number]>([
      [0, 0],
      [1, 0],
      [0, 1]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set([[0, 0]]));
  });
  it("should keep living cell with three neighbors", () => {
    const grid = new Set<[number, number]>([
      [0, 0],
      [1, 0],
      [0, 1],
      [0, -1]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set([[0, 0]]));
  });
  it("should kill living cell with four neighbors (overpopulation)", () => {
    const grid = new Set<[number, number]>([
      [0, 0],
      [1, 0],
      [0, 1],
      [0, -1],
      [-1, 0]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });
  it("should revive dead cell with exactly three neighbors", () => {
    const grid = new Set<[number, number]>([
      [1, 0],
      [0, 1],
      [0, -1]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set([[0, 0]]));
  });
  it("should not revive dead cell with two neighbors", () => {
    const grid = new Set<[number, number]>([
      [1, 0],
      [0, 1]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });
  it("should not revive dead cell with four neighbors", () => {
    const grid = new Set<[number, number]>([
      [1, 0],
      [0, 1],
      [0, -1],
      [-1, 0]
    ]);
    expect(nextGeneration(grid)).toEqual(new Set());
  });
  it("should handle multiple living cells in next generation", () => {
    const grid = new Set<[number, number]>([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ]);
    const next = nextGeneration(grid);
    expect(next.size).toBeGreaterThan(0);
  });
  it("should handle negative coordinates", () => {
    const grid = new Set<[number, number]>([
      [0, -1],
      [-1, 0],
      [0, 1]
    ]);
    const next = nextGeneration(grid);
    // [0, 0] should be revived (3 neighbors)
    let hasZeroZero = false;
    for (const [x, y] of next) {
      if (x === 0 && y === 0) {
        hasZeroZero = true;
        break;
      }
    }
    expect(hasZeroZero).toBe(true);
  });
  it("should handle sparse grid efficiently", () => {
    const grid = new Set<[number, number]>([
      [0, 0],
      [100, 100]
    ]);
    const next = nextGeneration(grid);
    // Both cells should die (no neighbors)
    expect(next.size).toBe(0);
  });
});
