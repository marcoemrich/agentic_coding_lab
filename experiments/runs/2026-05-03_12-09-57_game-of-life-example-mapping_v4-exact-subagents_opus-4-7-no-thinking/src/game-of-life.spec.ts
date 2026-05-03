import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a live cell with 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a 2x2 block unchanged (still life)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(result.length).toBe(4);
  });
  it("should oscillate a vertical blinker to horizontal (oscillator)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result.length).toBe(3);
  });
  it("should handle negative coordinates", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toEqual(expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]]));
    expect(result.length).toBe(3);
  });
});
