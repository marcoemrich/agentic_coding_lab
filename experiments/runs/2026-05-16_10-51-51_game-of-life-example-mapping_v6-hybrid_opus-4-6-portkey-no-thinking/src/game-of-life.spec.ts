import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty array for empty grid");
  it.todo("should kill a single cell with no neighbors (underpopulation)");
  it.todo("should kill two adjacent cells with only one neighbor each (underpopulation)");
  it.todo("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)");
  it.todo("should keep a cell alive that has 2 live neighbors (survival)");
  it.todo("should kill a cell with more than 3 live neighbors (overpopulation)");
  it.todo("should oscillate a blinker pattern");
});
