import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty grid when given empty grid");
  it.todo("should kill a single live cell (underpopulation)");
  it.todo("should kill two adjacent cells (underpopulation, each has only 1 neighbor)");
  it.todo("should keep a live cell alive with exactly 2 neighbors (survival)");
  it.todo("should keep a live cell alive with exactly 3 neighbors (survival)");
  it.todo("should kill a live cell with more than 3 neighbors (overpopulation)");
  it.todo("should birth a dead cell with exactly 3 neighbors (reproduction)");
  it.todo("should produce correct next generation for blinker oscillator");
  it.todo("should produce correct next generation for block still life");
});
