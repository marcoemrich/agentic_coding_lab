import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should bring dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep alive a cell with exactly 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a cell with more than 3 live neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 neighbors → dies
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern", () => {
    // Vertical blinker → horizontal blinker
    const gen0 = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toHaveLength(3);
    expect(gen1).toContainEqual([-1, 1]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toContainEqual([1, 1]);
  });
});
