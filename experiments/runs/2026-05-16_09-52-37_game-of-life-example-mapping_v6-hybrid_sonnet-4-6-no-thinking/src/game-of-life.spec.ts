import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty grid when given empty grid");
  it.todo("should kill a single live cell (underpopulation)");
  it.todo("should kill two adjacent cells with only 1 neighbor each (underpopulation)");
  it.todo("should keep a live cell alive when it has exactly 2 neighbors (survival)");
  it.todo("should keep a live cell alive when it has exactly 3 neighbors (survival)");
  it.todo("should kill a live cell with more than 3 neighbors (overpopulation)");
  it.todo("should birth a dead cell with exactly 3 neighbors (reproduction)");
  it.todo("should correctly compute blinker oscillator next generation");
  it.todo("should correctly compute block still life (unchanged next generation)");
});
