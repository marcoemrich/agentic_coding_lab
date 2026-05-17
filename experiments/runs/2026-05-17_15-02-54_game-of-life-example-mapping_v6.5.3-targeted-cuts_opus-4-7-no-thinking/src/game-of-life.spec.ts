import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells (underpopulation: each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a 2x2 block alive unchanged (each cell has 3 neighbors)", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("creates a new cell where a dead cell has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1) — dead cell (1,1) has 3 live neighbors, becomes alive.
    // All three live cells also have 2 neighbors each, so they survive too.
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const expected: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
  it("kills a cell with more than 3 live neighbors (overpopulation)", () => {
    // ###    Center (1,1) has 6 live neighbors (top row + bottom row corners + middles)
    // .#.    so it dies from overpopulation.
    // ###
    const input: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
});
