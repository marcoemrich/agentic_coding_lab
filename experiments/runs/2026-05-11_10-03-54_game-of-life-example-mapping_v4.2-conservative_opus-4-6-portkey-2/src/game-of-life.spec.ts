import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having fewer than 2 neighbors", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2 square) unchanged as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should keep a live cell with exactly 2 neighbors alive", () => {
    // Three cells in a row: (0,0), (1,0), (2,0). The center cell (1,0) has exactly 2 neighbors.
    const cells: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a live cell with exactly 3 neighbors alive", () => {
    // L-shape: (0,0), (1,0), (0,1), (1,1). The cell (0,0) has exactly 3 neighbors.
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Plus/cross pattern: center (1,1) has 4 neighbors
    const cells: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1). Dead cell (1,1) has exactly 3 live neighbors → becomes alive.
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    // Vertical blinker: (0,0), (0,1), (0,2)
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    // Expected horizontal: (-1,1), (0,1), (1,1)
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
