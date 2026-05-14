import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array for a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty array for two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should create a new live cell at a dead position with exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a live cell alive when it has 2 or 3 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged: [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    const toKey = (c: [number, number]) => `${c[0]},${c[1]}`;
    expect(new Set(result.map(toKey))).toEqual(new Set(input.map(toKey)));
  });
  it("should oscillate a blinker: [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(input);
    const sortKey = (c: [number, number]) => `${c[0]},${c[1]}`;
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(result.map(sortKey).sort()).toEqual(expected.map(sortKey).sort());
  });
});
