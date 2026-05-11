import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep alive a cell with exactly 2 neighbors (survival)", () => {
    // L-shape: (0,0) has 2 neighbors: (1,0) and (0,1) -> survives
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("should keep alive a cell with exactly 3 neighbors (survival)", () => {
    // Cell (1,1) has 3 neighbors: (1,0), (0,1), (2,1) -> survives
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a cell with 4 neighbors (overpopulation)", () => {
    // Plus/cross pattern: center cell (1,1) has 4 neighbors
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) - dead cell (1,1) has exactly 3 live neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(block));
  });
  it("should oscillate a blinker pattern (oscillator)", () => {
    const blinkerGen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerGen0);
    const sorted = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const expectedGen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(result)).toEqual(sorted(expectedGen1));
  });
});
