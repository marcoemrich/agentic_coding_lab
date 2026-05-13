import { describe, it, expect } from "vitest";
import { advanceGeneration } from "./game.js";

describe("Game of Life", () => {
  it.todo("should return empty array when starting with no living cells");
  it.todo("should kill a single cell after one step");
  it.todo("should kill two adjacent cells after one step");
  it.todo("should oscillate three cells in a line (blinker pattern)");
  it.todo("should keep four cells in a square stable (block pattern)");
  it.todo("should advance multiple steps correctly");
  it.todo("should handle negative coordinates");
  it.todo("should return results sorted lexicographically by x then y");
});
