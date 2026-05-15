import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells each with one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block of 2x2 cells unchanged (still life, survival)", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const expected: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should transform a vertical blinker into a horizontal blinker (survival and reproduction)", () => {
    const input: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const input: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    const input: Array<[number, number]> = [[-1, -1], [-2, -1], [-3, -1]];
    const expected: Array<[number, number]> = [[-2, 0], [-2, -1], [-2, -2]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
