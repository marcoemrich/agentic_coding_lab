import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should return empty array when given single live cell -- underpopulation (0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should return empty array when given two adjacent live cells -- underpopulation (1 neighbor each)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("should keep cell alive when live cell has exactly 2 live neighbors -- survival rule", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1]]);
  });

  it("should keep cell alive when live cell has exactly 3 live neighbors -- survival rule", () => {
    expect(nextGeneration([[0, 1], [1, 0], [1, 2], [2, 1]])).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });

  it("should kill cell when live cell has 4 live neighbors -- overpopulation rule", () => {
    expect(nextGeneration([[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]])).toEqual([[1, 1]]);
  });

  it("should bring dead cell to life when it has exactly 3 live neighbors -- reproduction rule", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("should correctly evolve blinker pattern from vertical to horizontal orientation -- oscillator example", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it("should keep block pattern unchanged -- still life example", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });

  it("should handle negative coordinates correctly", () => {
    const pattern = [[-1, -1], [0, -1], [0, 0], [-1, 0]];
    expect(nextGeneration(pattern)).toEqual(pattern);
  });
  it.todo("should return empty array when given single live cell -- underpopulation (0 neighbors)");
  it.todo("should return empty array when given two adjacent live cells -- underpopulation (1 neighbor each)");
  it.todo("should keep cell alive when live cell has exactly 2 live neighbors -- survival rule");
  it.todo("should keep cell alive when live cell has exactly 3 live neighbors -- survival rule");
  it.todo("should kill cell when live cell has 4 live neighbors -- overpopulation rule");
  it.todo("should bring dead cell to life when it has exactly 3 live neighbors -- reproduction rule");
  it.todo("should correctly evolve blinker pattern from vertical to horizontal orientation -- oscillator example");
  it.todo("should keep block pattern unchanged -- still life example");
  it.todo("should handle negative coordinates correctly");
});