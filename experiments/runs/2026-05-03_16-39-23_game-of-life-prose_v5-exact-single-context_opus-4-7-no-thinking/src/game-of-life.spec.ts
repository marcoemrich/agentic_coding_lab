import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty set when given an empty set", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a live cell with only one live neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a live cell alive with two live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 1], [2, 2]])).toEqual([[1, 1]]);
  });
  it("should keep a live cell alive with three live neighbors", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("should kill a live cell with four or more live neighbors (overpopulation)", () => {
    const plus: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life with exactly three live neighbors (reproduction)", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle cells at negative coordinates", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
});
