import { describe, it, expect } from "vitest";
import { nextGeneration, simulate, Cell } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep a cell alive with exactly two neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a cell alive with exactly three neighbors", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    const cross: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(cross);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly three neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should advance multiple steps", () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = simulate(blinker, 2);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([2, 0]);
  });
  it("should return output sorted by x then y", () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(blinker);
    expect(result).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
});
