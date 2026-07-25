import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Rule 1: Underpopulation – simplest case
  it("should kill a single live cell with no neighbors (underpopulation) -- [] after [(0,0)]", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });

  // Rule 1: Underpopulation – two adjacent cells (each has 1 neighbor)
  it("should kill two adjacent cells (each has 1 neighbor) -- [] after [(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });

  // Rule 2: Survival – live cell with 2 neighbors
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    // L-shape: center (1,1) has 2 neighbors at (0,1) and (1,0)
    const result = nextGeneration([[0, 1], [1, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 2: Survival – live cell with 3 neighbors
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    // Block: (1,1) has 3 neighbors at (0,0), (1,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 3: Overpopulation – live cell with 4 neighbors dies
  it("should kill a live cell with more than 3 neighbors (overpopulation) -- center cell dies in surrounded pattern", () => {
    // Center (1,1) is alive and has 4 live neighbors
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    // (1,1) had 4 neighbors -> dies
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4: Reproduction – dead cell with exactly 3 neighbors becomes alive
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // Three cells forming L: dead cell (1,1) has exactly 3 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Pattern: Block (still life) – no changes
  it("should produce a stable block (still life) -- unchanged after [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });

  // Pattern: Blinker (oscillator) – tick 1
  it("should oscillate a blinker from vertical to horizontal -- [(-1,1),(0,1),(1,1)] after [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(result.sort()).toEqual(expected.sort());
  });

  // Pattern: Blinker (oscillator) – tick 2
  it("should oscillate a blinker back to vertical -- [(0,0),(0,1),(0,2)] after [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(result.sort()).toEqual(expected.sort());
  });

  // Constraint: Negative coordinates
  it("should handle negative coordinates correctly", () => {
    // Block at negative coords should be stable
    const block: Cell[] = [[-2, -1], [-1, -1], [-2, -2], [-1, -2]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });

  // Constraint: Empty grid
  it("should return empty array for empty input", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });

  // Constraint: Sparse / infinite grid – cells far apart die independently
  it("should handle isolated cells far apart -- all die with no neighbors", () => {
    const result = nextGeneration([[100, 200], [-50, -50], [0, 1000]]);
    expect(result).toEqual([]);
  });

  // Example from spec: Survival with center cell (1,1) has 3 neighbors
  it("should verify spec survival example -- (1,1) survives with 3 neighbors", () => {
    // From spec: Gen 0 has ### on row 0 and .#. on row 1
    // (1,1) has 3 neighbors at (0,0), (1,0), (2,0)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Example from spec: Overpopulation with center cell (1,1) has 4 neighbors
  it("should verify spec overpopulation example -- (1,1) dies with 4 neighbors", () => {
    // From spec: ### / .#. / ### -> center (1,1) has 4 neighbors -> dies
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Example from spec: Reproduction dead cell (1,1) has exactly 3 neighbors
  it("should verify spec reproduction example -- dead (1,1) becomes alive with 3 neighbors", () => {
    // From spec: ##. / #.. -> dead (1,1) has 3 neighbors at (0,0),(1,0),(0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
});
