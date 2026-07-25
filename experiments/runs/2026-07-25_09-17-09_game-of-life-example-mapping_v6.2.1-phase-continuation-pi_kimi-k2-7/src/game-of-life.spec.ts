import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill adjacent live cells with only one neighbor each -- [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged -- [(0,0), (1,0), (0,1), (1,1)] -> unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should let a live cell with three neighbors survive -- center (1,1) survives", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]])).toContainEqual([1, 1]);
  });
  it("should let a live cell with two neighbors survive -- two neighbors survive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 0]);
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([0, 1]);
  });
  it("should kill a live cell with four neighbors from overpopulation -- center (1,1) dies", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly three neighbors to life -- (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 1], [1, 0], [2, 1]])).toContainEqual([1, 1]);
  });
  it("should evolve a blinker oscillator one step -- [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
