import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep still life block unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should kill live cell with more than 3 neighbors (overpopulation)", () => {
    // Center (5,5) with 4 diagonal neighbors: each corner sees only center (1 neighbor -> underpop)
    // Center has 4 neighbors -> dies (overpopulation); corners have 1 neighbor -> die (underpopulation)
    // Mid-edge dead cells (4,5),(5,4),(5,6),(6,5) each have exactly 3 live neighbors -> born
    expect(nextGeneration([[5, 5], [4, 4], [6, 4], [4, 6], [6, 6]])).toEqual([[4, 5], [5, 4], [5, 6], [6, 5]]);
  });
  it("should revive dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1) — dead cell (1,1) has exactly 3 live neighbors → becomes alive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should transform blinker from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(horizontal.length);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
  it("should transform blinker from horizontal back to vertical", () => {
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(horizontal);
    expect(result).toHaveLength(vertical.length);
    expect(result).toEqual(expect.arrayContaining(vertical));
  });
});
