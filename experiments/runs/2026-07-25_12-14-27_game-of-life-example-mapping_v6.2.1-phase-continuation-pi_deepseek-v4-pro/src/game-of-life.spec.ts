import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest case: single cell dies (no neighbors)
  it("should kill a single live cell with no neighbors -- Gen 0: [(0,0)] -> Gen 1: []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation: live cell with < 2 neighbors dies
  it("should kill two live cells each with only 1 neighbor (underpopulation) -- Gen 0: [(0,1), (1,1)] -> Gen 1: []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival: live cell with 2 or 3 neighbors lives on
  it("should keep a live cell alive with 2 neighbors (survival) -- horizontal line of 3 with births above and below", () => {
    // Three in a horizontal line: (0,0),(1,0),(2,0)
    // (1,0) has 2 neighbors: (0,0) and (2,0) -> survives
    // (0,0) has 1 neighbor: (1,0) -> dies
    // (2,0) has 1 neighbor: (1,0) -> dies
    // (1,-1) dead with neighbors (0,0),(1,0),(2,0)=3 -> born
    // (1,1) dead with neighbors (0,0),(1,0),(2,0)=3 -> born
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual([[1, 0], [1, -1], [1, 1]]);
  });

  // Rule 3 – Overpopulation: live cell with > 3 neighbors dies
  it("should kill a cell with 4 neighbors (overpopulation) -- center cell with 4 neighbors dies", () => {
    // Center (0,0) with 4 neighbors: (1,0), (-1,0), (0,1), (0,-1)
    // (0,0) has 4 neighbors -> dies (overpopulation)
    const result = nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]);
    // Verify center (0,0) is NOT in result
    const hasCenter = result.some(([x, y]) => x === 0 && y === 0);
    expect(hasCenter).toBe(false);
  });

  // Rule 4 – Reproduction: dead cell with exactly 3 neighbors becomes alive
  it("should reproduce a dead cell with exactly 3 live neighbors -- Gen 0: [(0,0), (1,0), (0,1)] -> Gen 1 includes (1,1)", () => {
    // Three cells forming an L-shape: (0,0), (1,0), (0,1)
    // Dead cell (1,1) has 3 live neighbors -> becomes alive
    // Live cells: (0,0) - 1 neighbor (1,0) or check...
    // (0,0) neighbors: (1,0), (0,1) = 2 -> survives
    // (1,0) neighbors: (0,0), (0,1) = 2 -> survives
    // (0,1) neighbors: (0,0), (1,0) = 2 -> survives
    // (1,1) dead, neighbors: (0,0), (1,0), (0,1) = 3 -> born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
    expect(result).toHaveLength(4);
  });

  // Pattern example: Block (still life)
  it("should keep a 2x2 block unchanged (still life) -- Gen 0: [(0,0), (1,0), (0,1), (1,1)] -> Gen 1: same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    // Each cell has exactly 3 neighbors, so all survive and no new cells are born
    expect(result).toEqual(block);
  });

  // Pattern example: Blinker (oscillator)
  it("should oscillate a vertical blinker to horizontal -- Gen 0: [(0,0), (0,1), (0,2)] -> Gen 1: [(-1,1), (0,1), (1,1)]", () => {
    // Vertical blinker: three cells in a column at x=0, y=0,1,2
    // (0,1) has 2 neighbors: (0,0) and (0,2) -> survives
    // (0,0) has 1 neighbor (0,1) -> dies
    // (0,2) has 1 neighbor (0,1) -> dies
    // (-1,1) dead with neighbors (0,0),(0,1),(0,2)=3 -> born
    // (1,1) dead with neighbors (0,0),(0,1),(0,2)=3 -> born
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    // Sort for deterministic comparison
    result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(result).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});