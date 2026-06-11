// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single live cell die (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two neighboring cells die, each having only one live neighbor (underpopulation)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });
  it("should keep a live cell with three live neighbors alive (survival)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ])
    ).toContainEqual([1, 1]);
  });
  it("should let a live cell with four live neighbors die (overpopulation)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
      ])
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly three live neighbors to life (reproduction)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ])
    ).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
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
  it("should oscillate a vertical blinker into a horizontal blinker with negative coordinates", () => {
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
});
