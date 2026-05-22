import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given an empty array (empty input → empty output)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single live cell at (0,0) dies (0 neighbors) → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 - Underpopulation: two adjacent cells [(0,1), (1,1)] both die (1 neighbor each) → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive — [(0,2), (1,2), (0,1)] produces (1,1) among the live cells of next gen", () => {
    expect(nextGeneration([[0, 2], [1, 2], [0, 1]])).toContainEqual([1, 1]);
  });

  it("Rule 2 - Survival: center cell (1,1) with 3 live neighbors [(0,2),(1,2),(2,2)] survives in the next generation", () => {
    expect(nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]])).toContainEqual([1, 1]);
  });

  it("Rule 3 - Overpopulation: center cell (1,1) with 4 live neighbors (corners + center configuration) dies in next generation", () => {
    expect(nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });

  it("Block (still life): [(0,0), (1,0), (0,1), (1,1)] is unchanged after one generation", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("Blinker (oscillator): vertical [(0,0), (0,1), (0,2)] becomes horizontal [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });

  it("Handles negative coordinates: a blinker placed at negative coordinates oscillates correctly", () => {
    const result = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-11, -9], [-10, -9], [-9, -9]]));
  });
});
