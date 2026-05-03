import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it.todo("should return empty set for empty input");
  it.todo("should kill a single cell due to underpopulation");
  it.todo("should kill two adjacent cells due to underpopulation");
  it.todo("should apply birth rule for three cells in a row");
  it.todo("should keep a 2x2 block stable");
  it.todo("should handle negative integer coordinates");
});
