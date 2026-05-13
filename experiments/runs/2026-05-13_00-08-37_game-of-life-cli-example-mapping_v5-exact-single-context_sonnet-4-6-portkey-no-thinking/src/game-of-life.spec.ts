import { describe, it, expect } from "vitest";
import { advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid unchanged when steps is 0 and no cells alive", () => {
    expect(advance([], 0)).toEqual([]);
  });
  it("should return alive cells unchanged when steps is 0", () => {
    expect(advance([[1, 2], [3, 4]], 0)).toEqual([[1, 2], [3, 4]]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(advance([[0, 0]], 1)).toEqual([]);
  });
  it("should kill two isolated cells (underpopulation)", () => {
    expect(advance([[0, 0], [5, 5]], 1)).toEqual([]);
  });
  it("should reproduce: three cells in an L-shape produce a new cell", () => {
    // L-shape: (0,0), (1,0), (0,1) — each pair is adjacent/diagonal
    // (0,0): neighbors (1,0) and (0,1) → 2 live neighbors → survives
    // (1,0): neighbors (0,0) and (0,1) → 2 live neighbors → survives
    // (0,1): neighbors (0,0) and (1,0) → 2 live neighbors → survives
    // Dead cell (1,1): neighbors (0,0),(1,0),(0,1) → 3 live neighbors → born
    expect(advance([[0, 0], [1, 0], [0, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should survive: tub (still life) is unchanged after one step", () => {
    // Tub: each cell has exactly 2 live neighbors → all survive
    // No dead cell has 3 live neighbors → nothing born
    expect(advance([[0, 1], [1, 0], [1, 2], [2, 1]], 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should apply multiple steps", () => {
    // Blinker oscillates with period 2
    // Step 0 (horizontal): (0,1),(1,1),(2,1)
    // Step 1 (vertical):   (1,0),(1,1),(1,2)
    // Step 2 (horizontal): (0,1),(1,1),(2,1)
    expect(advance([[0, 1], [1, 1], [2, 1]], 2)).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
});
