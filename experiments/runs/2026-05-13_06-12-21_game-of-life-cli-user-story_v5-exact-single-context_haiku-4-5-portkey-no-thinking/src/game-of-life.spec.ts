import { describe, it, expect } from "vitest";
import { step } from "./game-of-life.js";

describe("Game of Life", () => {
  it.todo("should return empty aliveCells when starting with no living cells");
  it.todo("should return configuration unchanged when steps is 0");
  it.todo("should kill a single lonely cell after 1 step");
  it.todo("should kill two isolated cells after 1 step");
  it.todo("should apply basic survival rules: cell with 2-3 neighbors survives");
  it.todo("should apply birth rule: dead cell with exactly 3 neighbors becomes alive");
  it.todo("should handle a stable block pattern (2x2 square) unchanged");
  it.todo("should sort output lexicographically by x ascending, then y ascending");
  it.todo("should handle negative coordinates correctly");
  it.todo("should apply rules for multiple steps iteratively");
});
