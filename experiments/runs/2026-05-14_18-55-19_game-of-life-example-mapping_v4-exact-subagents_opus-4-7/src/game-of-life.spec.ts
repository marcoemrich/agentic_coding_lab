import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor - underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block still-life unchanged (each cell has 3 neighbors)", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const expected: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should oscillate a horizontal blinker into a vertical blinker", () => {
    const input: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const expected: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const input: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should support negative coordinates on the infinite grid", () => {
    const input: Array<[number, number]> = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Array<[number, number]> = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
