import { describe, it, expect } from "vitest";
import { advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it.todo("should return empty array when given empty starting configuration");
  it.todo("should return input unchanged when steps is 0");
  it.todo("should kill a single cell (underpopulation)");
  it.todo("should kill two isolated cells");
  it.todo("should keep a cell alive with 2 live neighbors");
  it.todo("should keep a cell alive with 3 live neighbors");
  it.todo("should birth a dead cell with exactly 3 live neighbors");
  it.todo("should advance one generation correctly with multiple cells");
  it.todo("should advance multiple generations");
  it.todo("should handle negative coordinates");
});
