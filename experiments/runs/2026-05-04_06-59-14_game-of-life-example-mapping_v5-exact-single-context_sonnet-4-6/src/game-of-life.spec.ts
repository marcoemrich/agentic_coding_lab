import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two live cells that each have only one neighbor", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors", () => {
    // Center cell (1,0) has 2 live neighbors: (0,0) and (2,0) → survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const sorted = [...result].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    expect(sorted).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell alive with exactly 3 neighbors", () => {
    // 2x2 block: each cell has 3 neighbors → still life (no change)
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    const sorted = [...result].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors → becomes alive; all 3 live cells survive with 2 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = [...result].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a live cell with more than 3 neighbors", () => {
    // Plus shape: center (1,1) has 4 live neighbors → dies; arms each have 3 → survive
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]);
    const sorted = [...result].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should correctly advance a blinker pattern by one generation", () => {
    // Vertical blinker → horizontal blinker
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sorted = [...result].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    expect(sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});
