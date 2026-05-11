import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive that has exactly two live neighbors (survival)", () => {
    expect(sorted(nextGeneration([[1, 0], [1, 1], [1, 2]]))).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
  it("should kill a cell with more than three live neighbors (overpopulation)", () => {
    const result = sorted(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]));
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should produce correct next generation for blinker oscillator pattern", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = sorted(nextGeneration(gen0));
    expect(gen1).toEqual([[-1, 1], [0, 1], [1, 1]]);
    const gen2 = sorted(nextGeneration(gen1));
    expect(gen2).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
