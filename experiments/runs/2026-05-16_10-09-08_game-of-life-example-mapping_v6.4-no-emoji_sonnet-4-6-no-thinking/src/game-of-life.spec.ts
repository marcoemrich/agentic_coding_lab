import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    // center cell (1,0) has 2 neighbors: (0,0) and (2,0) → survives
    // (0,0) and (2,0) each have 1 neighbor → die
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, 0]]);
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    // (1,0) has 3 neighbors: (0,0), (2,0), (1,1) → survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });
  it.todo("should birth a dead cell with exactly 3 live neighbors (reproduction)");
  it.todo("should kill a live cell with more than 3 neighbors (overpopulation)");
  it.todo("should correctly compute one step of a blinker oscillator");
});
