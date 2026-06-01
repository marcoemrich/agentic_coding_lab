import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill both cells of a domino (each has 1 neighbor) — Rule 1 Underpopulation: [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with 2 neighbors alive — Rule 2 Survival: center of a vertical triple survives", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    expect(nextGeneration(gen0)).toContainEqual([0, 1]);
  });
  it("should kill a live cell with more than 3 neighbors — Rule 3 Overpopulation: center (1,1) dies", () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life — Rule 4 Reproduction: (1,1) becomes alive", () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    expect(nextGeneration(gen0)).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result).toHaveLength(block.length);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a blinker — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(gen0);
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
