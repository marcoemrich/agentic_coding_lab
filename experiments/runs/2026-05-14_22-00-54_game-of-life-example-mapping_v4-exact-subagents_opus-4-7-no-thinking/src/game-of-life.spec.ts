import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block still life unchanged", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(input));
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should keep a live cell alive with 3 neighbors (survival)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1], [1, -1]];
    const result = nextGeneration(input);
    expect(result).not.toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    const input: [number, number][] = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("should handle cells with negative coordinates", () => {
    const input: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(input));
  });
});
