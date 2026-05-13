import { describe, it, expect } from "vitest";
import { advanceGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it.todo("should return empty grid when starting with no cells");
  it.todo("should kill a single isolated cell (underpopulation)");
  it.todo("should keep a cell alive with exactly 2 neighbors (survival)");
  it.todo("should keep a cell alive with exactly 3 neighbors (survival)");
  it.todo("should kill a cell with 4 neighbors (overpopulation)");
  it.todo("should birth a dead cell with exactly 3 neighbors (reproduction)");
  it.todo("should handle the tub still life pattern across one generation");
  it.todo("should handle multiple generations with the blinker pattern");
});
