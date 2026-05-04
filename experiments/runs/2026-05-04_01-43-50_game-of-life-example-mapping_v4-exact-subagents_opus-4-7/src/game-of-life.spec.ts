import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty list when given empty list", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells, each with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toContainEqual([1, 0]);
  });
  it("should kill the center cell of a 3x3 block which has more than 3 live neighbors (overpopulation)", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a 2x2 block unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const verticalBlinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    for (const cell of expected) {
      expect(result).toContainEqual(cell);
    }
  });
  it("should handle negative coordinates correctly", () => {
    const verticalBlinker: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const expected: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    for (const cell of expected) {
      expect(result).toContainEqual(cell);
    }
  });
});
