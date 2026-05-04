import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty grid when given empty grid");
  it.todo("should kill single live cell (underpopulation)");
  it.todo("should kill two adjacent cells (underpopulation)");
  it.todo("should keep live cell with exactly 2 neighbors alive (survival)");
  it.todo("should keep live cell with exactly 3 neighbors alive (survival)");
  it.todo("should kill live cell with 4 or more neighbors (overpopulation)");
  it.todo("should create live cell at dead position with exactly 3 neighbors (reproduction)");
  it.todo("should keep block pattern stable (2x2 square still life)");
  it.todo("should rotate blinker pattern 90 degrees");
});
