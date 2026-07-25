import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Empty grid
  it("should return empty grid for empty input -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (simplest cell rule example)
  it("should kill a single live cell with no neighbors -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (< 2 neighbors)
  it("should kill all live cells when each has only 1 neighbor (underpopulation example) -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2: Survival (2 or 3 neighbors) - from spec example
  it("should keep center cell alive with 3 neighbors (survival example) -- center (1,1) survives", () => {
    // Gen 0: ### / ... / .#.
    // Surviving: (1,0) has 2 live neighbors
    // Born: (0,1) has 3 neighbors, (1,-1) has 3, (2,1) has 3
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(input);
    // Expect 4 cells: (0,1), (1,-1), (1,0), (2,1)
    expect(result).toEqual(expect.arrayContaining([[0, 1], [1, -1], [1, 0], [2, 1]]));
    expect(result.length).toBe(4);
  });

  // Rule 3: Overpopulation (> 3 neighbors)
  it("should kill center cell with 4 neighbors (overpopulation example) -- center (1,1) dies", () => {
    // Gen 0: ### / .#. / ###
    // Center (1,1) has 5 live neighbors → dies (overpopulation)
    // Corners (0,0),(2,0),(0,2),(2,2) each have 3 → survive
    // (1,0),(1,2) each have 3 → survive (edge of pattern, not center)
    // (1,-1),(1,3) are born from 3 neighbors each
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(input);
    expect(result).toEqual(expect.arrayContaining([
      [0, 0], [0, 2], [1, -1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 2]
    ]));
    expect(result.length).toBe(8);
  });

  // Rule 4: Reproduction (exactly 3 neighbors)
  it("should bring dead cell to life with exactly 3 neighbors (reproduction example) -- dead (1,1) becomes alive", () => {
    // Gen 0: ##. / #.. / ...
    // Cells: (0,0),(1,0),(0,1)
    // (1,1) has 3 neighbors: (0,0),(1,0),(0,1) → born
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    // (0,0) has 2 neighbors → survives; (1,0) has 2 → survives; (0,1) has 2 → survives; (1,1) born
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(result.length).toBe(4);
  });

  // Block (still life) - combination pattern
  it("should produce identical block (still life) -- [(0,0),(1,0),(0,1),(1,1)] → unchanged", () => {
    // Block: 2x2 square, each cell has 3 neighbors → all survive
    // No dead cell has exactly 3 → nothing born
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result.length).toBe(4);
  });

  // Blinker period 1
  it("should oscillate blinker vertically → horizontally -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    // Blinker: vertical line of 3 cells
    // (0,1) has 2 neighbors → survives
    // (0,0) has 1 neighbor → dies; (0,2) has 1 neighbor → dies
    // (-1,1) has 3 neighbors: (0,0),(0,1),(0,2) → born
    // (1,1) has 3 neighbors: (0,0),(0,1),(0,2) → born
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(input);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result.length).toBe(3);
  });
});