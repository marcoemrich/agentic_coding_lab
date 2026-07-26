import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return no living cells for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single living cell die from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two adjacent living cells die from underpopulation", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
    ).toEqual([]);
  });
  it("should let a living cell with 2 live neighbors survive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toContainEqual([1, 0]);
  });
  it("should let a living cell with 3 live neighbors survive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toContainEqual([0, 0]);
  });
  it("should let a living cell with more than 3 live neighbors die from overpopulation", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    const next = nextGeneration([
      [1, 0],
      [1, 1],
      [1, 2],
    ]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(
      expect.arrayContaining([
        [0, 1],
        [1, 1],
        [2, 1],
      ]),
    );
  });
  it("should oscillate a blinker from horizontal back to vertical", () => {
    const next = nextGeneration([
      [0, 1],
      [1, 1],
      [2, 1],
    ]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(
      expect.arrayContaining([
        [1, 0],
        [1, 1],
        [1, 2],
      ]),
    );
  });
  it("should handle cells at negative coordinates", () => {
    const next = nextGeneration([
      [-1, -2],
      [-1, -1],
      [-1, 0],
    ]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(
      expect.arrayContaining([
        [-2, -1],
        [-1, -1],
        [0, -1],
      ]),
    );
  });
});
