import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two neighboring cells (both have only 1 neighbor)", () => {
    // From spec: [(0,1), (1,1)] → []
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should apply reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // From spec: [(0,0),(1,0),(0,1)] → dead cell (1,1) has 3 neighbors → becomes alive
    // Also (0,0) has 2 neighbors → survives; (1,0) has 2 neighbors → survives; (0,1) has 2 neighbors → survives
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate: blinker returns to original after 2 generations", () => {
    // Gen 0: vertical blinker [(0,0),(0,1),(0,2)]
    // Gen 1: horizontal blinker [(-1,1),(0,1),(1,1)]
    // Gen 2: back to vertical [(0,0),(0,1),(0,2)]
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    const gen2 = nextGeneration(gen1);
    expect(gen2).toContainEqual([0, 0]);
    expect(gen2).toContainEqual([0, 1]);
    expect(gen2).toContainEqual([0, 2]);
    expect(gen2).toHaveLength(3);
  });
  it("should remain stable: block still life is unchanged after one generation", () => {
    // Block: [(0,0),(1,0),(0,1),(1,1)] → unchanged
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([1, 1]);
  });
});
