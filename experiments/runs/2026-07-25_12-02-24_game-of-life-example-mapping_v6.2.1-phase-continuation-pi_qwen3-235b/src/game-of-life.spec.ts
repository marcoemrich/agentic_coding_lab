import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when input is empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  }); // PASSED
  it("should return empty array when single cell dies due to underpopulation -- [(0,0)] → []", () => {
    expect(nextGeneration([[0,0]])).toEqual([]);
  }); // PASSED
  it("should return next state for blinker pattern (oscillator) -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    expect(nextGeneration([[0,0], [0,1], [0,2]])).toEqual([[-1,1], [0,1], [1,1]]);
  }); // PASSED
  it("should return next state for block pattern (still life) -- [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    expect(nextGeneration([[0,0], [1,0], [0,1], [1,1]])).toEqual(expect.arrayContaining([[0,0], [1,0], [0,1], [1,1]]));
    expect(nextGeneration([[0,0], [1,0], [0,1], [1,1]])).toHaveLength(4);
  }); // PASSED
  it("should handle underpopulation: live cell with fewer than 2 live neighbors dies -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0,1], [1,1]])).toEqual([]);
  }); // PASSED
  it("should handle survival: live cell with 2 or 3 live neighbors lives on -- center cell (1,1) has 3 neighbors → survives", () => {
    const result = nextGeneration([[1,1], [0,1], [1,0], [2,1]]);
    expect(result).toContainEqual([1,1]);
  }); // PASSED
  it("should handle overpopulation: live cell with more than 3 live neighbors dies -- center cell (1,1) has 4 neighbors → dies", () => {
    expect(nextGeneration([[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]])).toEqual([[-1,1], [0,0], [0,2], [1,-1], [1,3], [2,0], [2,2], [3,1]]);
  }); // PASSED
  it("should handle reproduction: dead cell with exactly 3 live neighbors becomes alive -- dead cell (1,1) has 3 neighbors → becomes alive", () => {
    expect(nextGeneration([[0,0], [0,1], [1,0]])).toEqual([[0,0], [0,1], [1,0], [1,1]]);
  }); // PASSED
});