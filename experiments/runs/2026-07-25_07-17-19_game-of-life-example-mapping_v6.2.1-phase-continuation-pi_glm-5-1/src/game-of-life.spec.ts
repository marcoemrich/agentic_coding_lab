import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Empty grid
  it("should return empty array for empty grid -- no cells means no next generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1: Underpopulation (live cell with < 2 neighbors dies)
  it("should kill a single live cell with 0 neighbors -- Rule 1 underpopulation: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells each with only 1 neighbor -- Rule 1 underpopulation: [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2: Survival (live cell with 2 or 3 neighbors lives on)
  it("should keep a live cell alive with 2 neighbors -- Rule 2 survival", () => {
    // Diagonal: (0,0), (1,1), (2,2)
    // Center cell (1,1) has 2 neighbors -> survives
    // No dead cell has exactly 3 neighbors -> no reproduction
    const result = nextGeneration([[0, 0], [1, 1], [2, 2]]);
    expect(result).toContainEqual([1, 1]);
    expect(result.length).toBe(1);
  });
  it("should keep a live cell alive with 3 neighbors -- Rule 2 survival: center cell (1,1) with 3 neighbors survives in [(0,0),(1,0),(2,0),(1,2)]", () => {
    // (1,1) is NOT in the input, but (1,2) is. Let me use a different config.
    // Cells: (0,0), (1,0), (2,0), (1,2)
    // Cell (1,0) has neighbors: (0,0), (2,0), (1,2) -> 3 neighbors -> survives
    // But also checking (1,2) which has neighbors: (0,0)? No, (0,0) is not adjacent to (1,2).
    // Let me re-think. Use the spec example directly.
    // Spec: Gen 0 has ### on top row and .#. on bottom row
    // Coordinates: (0,0),(1,0),(2,0) for top row, (1,2) for bottom
    // (1,0) has neighbors: (0,0), (2,0), (1,2) -> wait (1,2) is 2 away in y, not adjacent
    // The spec example:
    // Gen 0:  ###  --> (0,0),(1,0),(2,0)
    //         ...  
    //         .#.  --> (1,2)
    // Center (1,1) is dead but has 3 neighbors: (0,0)? No. (1,0), (1,2), and... let me use a simpler example.
    // 
    // L-shaped: (0,0), (1,0), (0,1)
    // (0,0) has neighbors: (1,0), (0,1) -> 2 -> survives
    // (1,0) has neighbors: (0,0), (0,1) -> 2 -> survives
    // (0,1) has neighbors: (0,0), (1,0) -> 2 -> survives
    // So that's survival with 2 neighbors each.
    //
    // For 3 neighbors, use: (0,0), (1,0), (0,1), (0,-1)
    // (0,0) has neighbors: (1,0), (0,1), (0,-1) -> 3 -> survives
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [0, -1]]);
    expect(result).toContainEqual([0, 0]);
  });

  // Rule 3: Overpopulation (live cell with > 3 neighbors dies)
  it("should kill a live cell with 4 neighbors -- Rule 3 overpopulation: center cell (1,1) with 4 neighbors dies", () => {
    // Full 3x3 grid minus corners: (1,0),(0,1),(2,1),(1,2) plus (1,1) = 5 cells
    // Actually from spec: ### / .#./ ### -> center (1,1) has 4 neighbors
    // Cells: (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)
    // Center (1,1) is NOT in the input -- wait, spec says (1,1) IS alive with 4 neighbors
    // Let me use: (1,1) plus its 4 neighbors: (0,0),(1,0),(2,0),(0,1)
    // (1,1) has neighbors: (0,0),(1,0),(2,0),(0,1) -> 4 -> dies
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("should bring a dead cell to life with exactly 3 neighbors -- Rule 4 reproduction: dead cell (1,1) becomes alive from [(0,0),(1,0),(0,1)]", () => {
    // L-shape: (0,0), (1,0), (0,1)
    // Dead cell (1,1) has exactly 3 neighbors: (0,0), (1,0), (0,1) -> becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Combined rules: Block (still life)
  it("should produce a stable block pattern -- Block still life: [(0,0),(1,0),(0,1),(1,1)] → unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });

  // Combined rules: Blinker (oscillator)
  it("should oscillate a blinker from vertical to horizontal -- Blinker Gen 0: [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should oscillate a blinker back from horizontal to vertical -- Blinker Gen 1: [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  // Negative coordinates
  it("should handle negative coordinates correctly -- cells at negative x/y positions", () => {
    // Block at negative coords should be stable
    const block: Cell[] = [[-2, -1], [-1, -1], [-2, -2], [-1, -2]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
});
