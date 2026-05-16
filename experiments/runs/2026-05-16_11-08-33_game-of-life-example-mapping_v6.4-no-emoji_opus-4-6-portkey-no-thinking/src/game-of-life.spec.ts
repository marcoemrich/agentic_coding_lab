import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty array for empty grid");
  it.todo("should kill a single live cell with no neighbors (underpopulation)");
  it.todo("should kill two adjacent cells each having only one neighbor (underpopulation)");
  it.todo("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)");
  it.todo("should keep a live cell alive when it has exactly 2 neighbors (survival)");
  it.todo("should keep a live cell alive when it has exactly 3 neighbors (survival)");
  it.todo("should kill a live cell with more than 3 neighbors (overpopulation)");
  it.todo("should keep a block pattern stable (still life)");
  it.todo("should oscillate a blinker pattern");
});
