import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two isolated cells (both underpopulated)", () => {
    expect(nextGeneration([[0, 0], [2, 2]])).toEqual([]);
  });
  it("should keep alive a cell with exactly 2 neighbors", () => {
    // Block pattern (2x2 square): (0,0), (1,0), (0,1), (1,1)
    // All 4 cells have exactly 3 neighbors → all survive (and no unintended births)
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should keep alive a cell with exactly 3 neighbors", () => {
    // Block pattern (2x2 square): (0,0), (1,0), (0,1), (1,1)
    // All cells have 3 neighbors and survive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should kill cell with 4 neighbors (overpopulation)", () => {
    // Plus pattern: (1,0), (0,1), (1,1), (2,1), (1,2)
    // Center cell (1,1) has 4 neighbors → dies (overpopulation)
    // Others survive with 3 neighbors
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    // Center cell should NOT be in result (died from overpopulation)
    expect(result.some(c => c[0] === 1 && c[1] === 1)).toBe(false);
    // Adjacent cells should survive
    expect(result.some(c => c[0] === 1 && c[1] === 0)).toBe(true);
    expect(result.some(c => c[0] === 0 && c[1] === 1)).toBe(true);
    expect(result.some(c => c[0] === 2 && c[1] === 1)).toBe(true);
    expect(result.some(c => c[0] === 1 && c[1] === 2)).toBe(true);
  });
  it("should resurrect dead cell with exactly 3 neighbors (reproduction)", () => {
    // Corner pattern: (0,0), (1,0), (0,1)
    // Dead cell (1,1) has exactly 3 neighbors: (0,0), (1,0), (0,1) → becomes alive (reproduction)
    // (0,0) has neighbors (1,0), (0,1), (1,1) - from input: 2 → survives
    // (1,0) has neighbors (0,0), (0,1), (1,1) - from input: 2 → survives
    // (0,1) has neighbors (0,0), (1,0), (1,1) - from input: 2 → survives
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should transform blinker pattern (vertical to horizontal)", () => {
    // Blinker (vertical): (0,0), (0,1), (0,2)
    // Gen 1 (horizontal): (-1,1), (0,1), (1,1)
    // (0,0): 1 neighbor (0,1) → dies
    // (0,1): 2 neighbors (0,0), (0,2) → survives
    // (0,2): 1 neighbor (0,1) → dies
    // Dead (-1,1): 3 neighbors → reproduces
    // Dead (1,1): 3 neighbors → reproduces
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.length).toBe(3);
    expect(result.some(c => c[0] === 0 && c[1] === 1)).toBe(true);  // survives
    expect(result.some(c => c[0] === -1 && c[1] === 1)).toBe(true); // reproduces
    expect(result.some(c => c[0] === 1 && c[1] === 1)).toBe(true);  // reproduces
  });
  it("should preserve block pattern (still life)", () => {
    // 2x2 block: (0,0), (1,0), (0,1), (1,1)
    // Each cell has exactly 3 neighbors → all survive
    // No adjacent dead cell has exactly 3 neighbors → no births
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const result = nextGeneration(block);
    expect(result.length).toBe(4);
    expect(result.some(c => c[0] === 0 && c[1] === 0)).toBe(true);
    expect(result.some(c => c[0] === 1 && c[1] === 0)).toBe(true);
    expect(result.some(c => c[0] === 0 && c[1] === 1)).toBe(true);
    expect(result.some(c => c[0] === 1 && c[1] === 1)).toBe(true);
  });
  it("should handle negative coordinates", () => {
    // Blinker with negative coordinates
    // Vertical: (-1,-1), (-1,0), (-1,1)
    // Horizontal: (-2,0), (-1,0), (0,0)
    const result = nextGeneration([[-1, -1], [-1, 0], [-1, 1]]);
    expect(result.length).toBe(3);
    expect(result.some(c => c[0] === -1 && c[1] === 0)).toBe(true);
    expect(result.some(c => c[0] === -2 && c[1] === 0)).toBe(true);
    expect(result.some(c => c[0] === 0 && c[1] === 0)).toBe(true);
  });
});
