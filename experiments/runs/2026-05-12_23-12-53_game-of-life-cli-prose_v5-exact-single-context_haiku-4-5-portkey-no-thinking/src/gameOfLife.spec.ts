import { describe, it, expect } from "vitest";
import { advanceGeneration } from "./gameOfLife.js";

describe("Conway's Game of Life", () => {
  it.todo("should return empty grid when starting with empty grid and 0 steps");
  it.todo("should return input unchanged when steps is 0");
  it.todo("should kill a single live cell (underpopulation)");
  it.todo("should kill two live cells (underpopulation)");
  it.todo("should maintain a 2x2 block (stable pattern)");
  it.todo("should oscillate a blinker pattern (vertical to horizontal)");
  it.todo("should oscillate a blinker back (horizontal to vertical) after 2 generations");
  it.todo("should handle negative coordinates correctly");
  it.todo("should advance multiple generations correctly");
});
