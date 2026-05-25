import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array for single living cell (underpopulation) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation (live cell with < 2 neighbors dies)
  it("should kill two adjacent cells (each has 1 neighbor) -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival (live cell with 2 or 3 neighbors lives on)
  it("should keep center cell alive with 2 neighbors -- [(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toEqual([[1, 1]]);
  });
  it.todo("should keep center cell alive with 3 neighbors -- [(1,1)]");

  // Rule 3 – Overpopulation (live cell with > 3 neighbors dies)
  it.todo("should kill center cell with 4 neighbors -- without (1,1)");

  // Rule 4 – Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it.todo("should birth dead cell with exactly 3 neighbors -- includes (1,1)");

  // Pattern examples
  it.todo("should keep block unchanged (still life) -- [(0,0),(1,0),(0,1),(1,1)]");
  it.todo("should blink vertical to horizontal -- [(-1,1),(0,1),(1,1)]");
  it.todo("should blink horizontal back to vertical -- [(0,0),(0,1),(0,2)]");

  // Negative coordinates
  it.todo("should handle negative coordinates correctly");
});
