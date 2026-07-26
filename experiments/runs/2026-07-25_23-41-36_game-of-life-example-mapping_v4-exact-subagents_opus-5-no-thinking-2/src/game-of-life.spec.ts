import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return no living cells for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single living cell die of underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two adjacent living cells die of underpopulation", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should let a living cell with three neighbors survive", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should let a living cell with four neighbors die of overpopulation", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly three neighbors to life", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a block unchanged as a still life", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle cells at negative coordinates", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-6, -4]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
