import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill cells with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a cell alive with exactly two neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("should keep a cell alive with exactly three neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly three neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should preserve a block still life pattern", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a blinker pattern", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const gen1 = nextGeneration(vertical);
    expect(gen1).toHaveLength(3);
    expect(gen1).toEqual(expect.arrayContaining(horizontal));
    const gen2 = nextGeneration(gen1);
    expect(gen2).toHaveLength(3);
    expect(gen2).toEqual(expect.arrayContaining(vertical));
  });
});
