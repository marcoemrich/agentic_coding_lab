import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation: 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it.todo("should keep a live cell alive when it has exactly 2 neighbors (survival)");
  it.todo("should keep a live cell alive when it has exactly 3 neighbors (survival)");
  it.todo("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)");
  it.todo("should kill a live cell with more than 3 neighbors (overpopulation)");
  it.todo("should correctly compute the blinker oscillator next generation");
  it.todo("should correctly compute the block still life (unchanged next generation)");
});
