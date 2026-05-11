import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given no live cells", () => {
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
  it("should keep a block (2x2 square) unchanged as a still life (survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort(block));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has exactly 3 live neighbors
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sort(result)).toEqual(sort(expected));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Cross/plus pattern: center (1,1) has 4 neighbors -> dies
    const gen0: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(gen0);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // Center (1,1) dies from overpopulation; arms survive; 4 corners are born
    const expected: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(sort(result)).toEqual(sort(expected));
  });
  it("should evolve a vertical blinker into a horizontal blinker (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sort(result)).toEqual(sort(expected));
  });
});
