import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty grid when given empty grid");
  it.todo("should kill single cell due to underpopulation");
  it.todo("should keep block pattern alive (still life)");
  it.todo("should transform blinker pattern (oscillator)");
  it.todo("should create new cell by reproduction (3 neighbors)");
  it.todo("should handle negative coordinates");
});
