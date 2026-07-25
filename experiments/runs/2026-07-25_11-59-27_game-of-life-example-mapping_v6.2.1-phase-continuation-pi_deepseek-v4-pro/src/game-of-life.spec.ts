import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest case: empty grid
  it("should return empty grid for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (underpopulation: 0 neighbors)
  it("should kill a single live cell with no neighbors -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation
  it("should kill live cells with fewer than 2 neighbors -- [(0,1), (1,1)] → [] (each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction
  it("should revive dead cell with exactly 3 live neighbors -- [(0,0),(1,0),(0,1)] dead (1,1) → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(new Set(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(new Set([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  // Rule 2: Survival
  it("should keep live cell alive with 2 or 3 neighbors -- [(0,0),(1,0),(2,0)] → [(1,0),(1,-1),(1,1)]", () => {
    expect(new Set(nextGeneration([[0, 0], [1, 0], [2, 0]]))).toEqual(new Set([[1, 0], [1, -1], [1, 1]]));
  });

  // Rule 3: Overpopulation
  it("should kill live cell with more than 3 neighbors -- [(0,0),(2,0),(1,1),(0,2),(2,2)] → [(1,0),(0,1),(2,1),(1,2)]", () => {
    expect(new Set(nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]))).toEqual(new Set([[1, 0], [0, 1], [2, 1], [1, 2]]));
  });

  // Block still life
  it("should keep a 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(new Set(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(new Set([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  // Blinker oscillator (one step)
  it("should transform vertical blinker to horizontal -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expect(new Set(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(new Set([[-1, 1], [0, 1], [1, 1]]));
  });

  // Blinker oscillator (two steps)
  it("should return blinker to vertical after two generations -- [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    expect(new Set(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual(new Set([[0, 0], [0, 1], [0, 2]]));
  });
});