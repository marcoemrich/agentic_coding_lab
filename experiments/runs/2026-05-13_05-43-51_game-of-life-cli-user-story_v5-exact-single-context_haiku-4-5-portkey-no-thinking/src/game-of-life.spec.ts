import { describe, it, expect } from "vitest";
import { step } from "./game-of-life.js";

describe("Game of Life", () => {
  // Base: Single cell behavior
  it.todo("should kill a lone cell (fewer than 2 neighbors)");

  // Base: Two cell behavior
  it.todo("should kill two cells (each has 1 neighbor)");

  // Base: Three cell behavior (linear)
  it.todo("should keep three cells in a line (center cell has 2 neighbors)");

  // Base: Three cell behavior (square with 1 dead cell)
  it.todo("should create a fourth cell in a 2x2 square (dead cell has 3 neighbors)");

  // Base: Empty grid
  it.todo("should return empty for empty input");

  // Base: Single cell after one step
  it.todo("should return empty after one step from single cell");

  // Base: Blinker pattern (period 2)
  it.todo("should oscillate vertical blinker to horizontal after one step");

  // Base: Block pattern (still life)
  it.todo("should keep a 2x2 square stable across steps");

  // Base: Multiple steps
  it.todo("should advance by multiple steps correctly");

  // Base: Negative coordinates
  it.todo("should handle negative coordinates");

  // Base: Output sorting
  it.todo("should return alive cells in lexicographic order (x ascending, y ascending)");

  // Base: Zero steps
  it.todo("should return configuration unchanged for zero steps");
});
