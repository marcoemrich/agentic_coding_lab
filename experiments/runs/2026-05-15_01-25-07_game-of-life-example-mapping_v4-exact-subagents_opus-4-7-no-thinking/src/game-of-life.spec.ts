import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Conway's Game of Life - nextGeneration", () => {
  it("should return an empty array for an empty input", () => {
    const input: Cell[] = [];
    expect(nextGeneration(input)).toEqual([]);
  });
  it("should return an empty array for a single live cell (underpopulation)", () => {
    const input: Cell[] = [[0, 0]];
    expect(nextGeneration(input)).toEqual([]);
  });
  it("should return an empty array for two adjacent live cells (underpopulation)", () => {
    const input: Cell[] = [[0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual([]);
  });
  it("should keep a 2x2 block unchanged (still life)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(input));
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill the center cell of a 3x3 full block (overpopulation)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const expected: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2], [-1, 1], [3, 1], [1, -1], [1, 3]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(8);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
