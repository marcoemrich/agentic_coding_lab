import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest cases
  it("should return empty array when given empty array -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (< 2 neighbors dies)
  it("should kill two adjacent live cells each with 1 neighbor -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("should bring a dead cell with exactly 3 live neighbors to life -- Rule 4 example", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });

  // Rule 2: Survival (2 or 3 neighbors lives on)
  it("should keep a live cell with 2 neighbors alive -- Rule 2 (horizontal 3-in-a-row: center has 2 neighbors, survives)", () => {
    // Horizontal: (-1,0),(0,0),(1,0). Center (0,0) has 2 live neighbors -> survives.
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    // Result is vertical blinker through center: (0,-1),(0,0),(0,1).
    expect(result.map(c => c.join(",")).sort()).toEqual([[0, -1], [0, 0], [0, 1]].map(c => c.join(",")).sort());
  });

  // Rule 3: Overpopulation (> 3 neighbors dies)
  it("should kill a live cell with 4 neighbors -- Rule 3 example, center (1,1) dies", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(input);
    // Note: infinite grid also births (1,-1) and (1,3), each having exactly 3 live neighbors.
    const expected = [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]];
    expect(result.map(c => c.join(",")).sort()).toEqual(expected.map(c => c.join(",")).sort());
  });

  // Pattern: Block (still life)
  it("should keep a block unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.map(c => c.join(",")).sort()).toEqual(block.map(c => c.join(",")).sort());
  });

  // Pattern: Blinker (oscillator)
  it("should oscillate a vertical blinker to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.map(c => c.join(",")).sort()).toEqual([[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")).sort());
  });

  // Negative coordinates
  it("should handle negative coordinates -- blinker around origin works with negatives", () => {
    // Vertical blinker at x=-5: (-5,-1),(-5,0),(-5,1) -> horizontal: (-6,0),(-5,0),(-4,0)
    const result = nextGeneration([[-5, -1], [-5, 0], [-5, 1]]);
    expect(result.map(c => c.join(",")).sort()).toEqual([[-6, 0], [-5, 0], [-4, 0]].map(c => c.join(",")).sort());
  });
});
