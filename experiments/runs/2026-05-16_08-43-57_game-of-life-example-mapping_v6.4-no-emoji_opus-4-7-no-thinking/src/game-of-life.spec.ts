import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells each with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a live cell alive with exactly 2 live neighbors (survival)", () => {
    // Three cells in a row: (0,0), (1,0), (2,0)
    // Cell (1,0) has 2 live neighbors and should survive
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("keeps a live cell alive with exactly 3 live neighbors (survival)", () => {
    // 2x2 block: cell (0,0) has 3 live neighbors: (1,0), (0,1), (1,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("kills a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center cell (1,1) with 4 diagonal neighbors
    const result = nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors: (0,0), (1,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("transforms a vertical blinker to a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("keeps a 2x2 block unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker at negative coordinates
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-6, -4]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
