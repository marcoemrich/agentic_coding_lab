import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty array when given empty grid");
  it.todo("should kill a single live cell (underpopulation)");
  it.todo("should kill two adjacent live cells (underpopulation)");
  it.todo("should kill a live cell with more than 3 neighbors (overpopulation)");
  it.todo("should keep a live cell with exactly 2 neighbors alive (survival)");
  it.todo("should keep a live cell with exactly 3 neighbors alive (survival)");
  it.todo("should birth a dead cell with exactly 3 live neighbors (reproduction)");
  it.todo("should produce next generation of a blinker (oscillator pattern)");
  it.todo("should keep a 2x2 block unchanged (still life pattern)");
});
