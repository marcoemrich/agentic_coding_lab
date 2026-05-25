import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // 1. Simplest case
  it("should return empty array when given an empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // 2. Individual rules in isolation (Single cells, underpopulation, survival, overpopulation, reproduction)
  it("should return empty array when a single cell dies -- Gen 0: [(0,0)] -> Gen 1: []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  
  it("should die due to underpopulation with fewer than 2 live neighbors -- Gen 0: [(0,1), (1,1)] -> Gen 1: []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should survive with 2 live neighbors -- Gen 0: [(0,0), (1,0), (0,1)] (cells [(0,0), (1,0), (0,1)] each have 2 neighbors) -> Gen 1: should contain original cells plus the reproduction of (1,1)", () => {
    // Gen 0: [(0,0), (1,0), (0,1)]
    // Cells:
    // (0,0) has neighbors: (1,0) and (0,1). That is 2 neighbors. Survives!
    // (1,0) has neighbors: (0,0) and (0,1). That is 2 neighbors. Survives!
    // (0,1) has neighbors: (0,0) and (1,0). That is 2 neighbors. Survives!
    // (1,1) is dead and has 3 neighbors: (0,0), (1,0), (0,1). Reproduces!
    // So Gen 1 is: [(0,0), (1,0), (0,1), (1,1)]
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });

  it("should survive with 3 live neighbors (Rule 2) -- Gen 0 center (1,1) has 3 live neighbors in [(1,0), (0,1), (2,1), (1,1)] -> Gen 1 (1,1) survives", () => {
    const result = nextGeneration([[1, 0], [0, 1], [2, 1], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("should die due to overpopulation with more than 3 live neighbors (Rule 3) -- Gen 0 center (1,1) has 4 live neighbors in [(1,1), (0,1), (2,1), (1,0), (1,2)] -> Gen 1 (1,1) dies", () => {
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("should reproduce when a dead cell has exactly 3 live neighbors (Rule 4) -- Gen 0: [(0,0), (1,0), (0,1)] -> Gen 1: dead cell (1,1) has 3 neighbors -> (1,1) becomes alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // 3. Pattern Examples from Specification
  it("should correctly evolve a Blinker pattern -- Gen 0: [(0,0), (0,1), (0,2)] -> Gen 1: [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  
  it("should correctly remain stable for a Block pattern (still life) -- Gen 0: [(0,0), (1,0), (0,1), (1,1)] -> Gen 1: [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
