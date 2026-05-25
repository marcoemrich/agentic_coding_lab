import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("empty grid stays empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule-based examples
  it("underpopulation: two adjacent live cells die -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: live cell with 2 neighbors survives -- [(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 1], [2, 2]])).toEqual([[1, 1]]);
  });
  it("survival: live cell with 3 neighbors survives -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("overpopulation: live cell with 4 neighbors dies, birth occurs -- [(0,0),(2,0),(0,1),(2,1),(1,2)]", () => {
    // Cell (1,1) has 4 neighbors and dies; birth at (1,2) from exactly 3 neighbors.
    expect(nextGeneration([[0, 0], [1, 1], [2, 0], [0, 1], [2, 1]])).toEqual([[0, 0], [2, 0], [0, 1], [2, 1], [1, 2]]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  // Pattern examples
  it("blink oscillator: horizontal to vertical -- [(0,1),(-1,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[0, 1], [-1, 1], [1, 1]]);
  });
  it("still life: 2x2 block remains unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
