import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a block (still life) unchanged - 2x2 stable pattern", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("transforms vertical blinker to horizontal blinker", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(expected.sort());
  });
  it("kills center cell with 4 neighbors (overpopulation)", () => {
    // Center (1,1) has 4 corner neighbors → dies from overpopulation.
    const input: Array<[number, number]> = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors → becomes alive.
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
});
