import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Rule 1 - Underpopulation: live cell with fewer than 2 neighbors dies
  it("Rule 1: single cell with no neighbors dies -- [(0,0)] → []", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("Rule 1: two isolated cells each with 1 neighbor die -- [(0,1),(1,1)] → []", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });

  // Rule 2 - Survival: live cell with 2 or 3 neighbors lives on
  it("Rule 2: live cell with exactly 2 neighbors survives -- part of block pattern", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });
  it("Rule 2: live cell with exactly 3 neighbors survives -- spec example Gen0: ### / ... / .#.", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    // (1,1) has 3 live neighbors → survives
    expect(result.some(c => c[0] === 1 && c[1] === 1)).toBe(true);
  });

  // Rule 3 - Overpopulation: live cell with more than 3 neighbors dies
  it("Rule 3: live cell with 4 neighbors dies -- center of cross", () => {
    // Cross pattern: center (1,1) has 4 neighbors
    const result = nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2], [1, 0], [1, 2]]);
    expect(result.some(c => c[0] === 1 && c[1] === 1)).toBe(false);
  });

  // Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive
  it("Rule 4: dead cell with exactly 3 neighbors becomes alive -- L-shape [(0,0),(1,0),(0,1)] produces (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.some(c => c[0] === 1 && c[1] === 1)).toBe(true);
  });

  // Pattern examples from spec
  it("Block still life -- [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });
  it("Blinker oscillator Gen 0 → Gen 1 -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("Blinker oscillator Gen 1 → Gen 2 -- [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [0, 2]].sort());
  });
  it("Overpopulation example from spec -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] → [(0,0),(2,0),(0,2),(2,2),(1,0),(1,2),(1,-1),(1,3)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    // Center (1,1) dies (overpopulation: 4 neighbors)
    // Corners survive, edges survive with 2 neighbors each
    // (1,-1) born (3 neighbors: (0,0),(1,0),(2,0))
    // (1,3) born (3 neighbors: (0,2),(1,2),(2,2))
    expect(result.sort()).toEqual([[0, 0], [2, 0], [0, 2], [2, 2], [1, 0], [1, 2], [1, -1], [1, 3]].sort());
  });

  // Edge cases with infinite grid
  it("Empty grid returns empty -- [] → []", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("Negative coordinates work correctly -- cells at negative positions follow all rules", () => {
    // Block at negative coords should be a still life
    const result = nextGeneration([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
    expect(result.sort()).toEqual([[-1, -1], [0, -1], [-1, 0], [0, 0]].sort());
  });
});
