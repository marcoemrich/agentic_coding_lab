import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty array for empty grid");
  it.todo("should kill a single cell with no neighbors (underpopulation)");
  it.todo("should kill cells with only one neighbor (underpopulation)");
  it.todo("should keep a cell alive with exactly two neighbors (survival)");
  it.todo("should keep a cell alive with exactly three neighbors (survival)");
  it.todo("should kill a cell with more than three neighbors (overpopulation)");
  it.todo("should bring a dead cell to life with exactly three neighbors (reproduction)");
  it.todo("should keep a block pattern stable (still life)");
  it.todo("should oscillate a blinker pattern");
});
