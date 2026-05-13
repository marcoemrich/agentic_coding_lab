import { describe, it, expect } from "vitest";
import { advanceGenerations } from "./game-of-life.js";

describe("Game of Life", () => {
  it.todo("should return empty array when starting with no cells");
  it.todo("should return empty array for zero steps");
  it.todo("should kill a single cell (dies without neighbors)");
  it.todo("should kill two isolated cells");
  it.todo("should create blinker pattern from three cells in a line");
  it.todo("should keep block pattern (2x2) stable across generations");
  it.todo("should handle negative coordinates");
  it.todo("should return lexicographically sorted result (x ascending, then y ascending)");
});
