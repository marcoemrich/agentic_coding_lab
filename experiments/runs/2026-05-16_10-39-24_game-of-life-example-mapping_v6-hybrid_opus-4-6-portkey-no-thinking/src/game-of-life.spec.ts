import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty array for empty grid");
  it.todo("should kill a single cell with no neighbors (underpopulation)");
  it.todo("should kill two adjacent cells each having only one neighbor (underpopulation)");
  it.todo("should keep alive a cell with exactly 2 live neighbors (survival)");
  it.todo("should keep alive a cell with exactly 3 live neighbors (survival)");
  it.todo("should kill a cell with more than 3 live neighbors (overpopulation)");
  it.todo("should bring a dead cell with exactly 3 live neighbors to life (reproduction)");
  it.todo("should preserve a block pattern as a still life");
  it.todo("should oscillate a blinker pattern");
});
