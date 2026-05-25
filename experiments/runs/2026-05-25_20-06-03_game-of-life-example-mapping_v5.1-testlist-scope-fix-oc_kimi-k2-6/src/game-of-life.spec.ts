import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  // Individual rules, simple -> complex
  it("single cell dies (underpopulation) -- returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
    expect(nextGeneration([[1, 1]])).toEqual([]);
  });
  it("two adjacent live cells die (underpopulation) -- returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("cell with 2 neighbors survives (survival) -- returns live cells", () => {
    expect(nextGeneration([[0,0], [0,1], [0,2]])).toContainEqual([0,1]);
  });
  it("cell with 3 neighbors survives (survival) -- returns live cells", () => {
    const result = nextGeneration([[0,0], [0,1], [0,2], [1,1]]);
    expect(result).toContainEqual([0,1]);
    expect(result).toContainEqual([1,1]);
  });
  it.todo("cell with 4 neighbors dies (overpopulation) -- returns [] for that cell");
  it.todo("dead cell with exactly 3 neighbors becomes alive (reproduction) -- returns new cell");

  // Pattern examples
  it.todo("blinker oscillator evolves from vertical to horizontal -- returns horizontal cells");
  it.todo("block still life remains unchanged -- returns same cells");
});
