import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two cells each with 1 neighbor (Rule 1 underpopulation example)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep cell alive with 2 live neighbors (Rule 2 survival)", () => {
    // Three cells in a horizontal line. (1,1) survives (2 neighbors).
    // (1,0) and (1,2) are born (3 neighbors each). (0,1) and (2,1) die (1 neighbor).
    const result = nextGeneration([[0, 1], [1, 1], [2, 1]]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([1, 2]);
    expect(result).toHaveLength(3);
  });
  it("should keep cell alive with 3 live neighbors (Rule 2 survival)", () => {
    // Center (1,1) has 3 neighbors: (0,1), (2,1), (1,0)
    // (0,1) has 2 neighbors: (1,1), (1,0). (2,1) has 2 neighbors: (1,1), (1,0). (1,0) has 3 neighbors.
    // All survive (each has 2 or 3 neighbors).
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 0]]);
    // Verify the 3-neighbor cell survives:
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill cell with more than 3 neighbors (Rule 3 overpopulation example)", () => {
    // Plus-shape: center (1,1) has 4 neighbors → dies. Arms survive (3 neighbors each).
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    // Center (1,1) should die:
    expect(result).not.toContainEqual([1, 1]);
    // Arms should survive:
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([2, 1]);
    expect(result).toContainEqual([1, 2]);
  });
  it("should revive dead cell with exactly 3 neighbors (Rule 4 reproduction example)", () => {
    // Three cells forming an L-shape: dead cell at (1,1) has exactly 3 live neighbors
    // (0,0), (1,0), (0,1) are alive. (1,1) is dead but has 3 neighbors → revives.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should preserve block still life unchanged", () => {
    // 2×2 block: each cell has 3 live neighbors → all survive. No births.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(4);
  });
  it("should transform blinker from vertical to horizontal (gen 0 → gen 1)", () => {
    // Vertical blinker: (0,0), (0,1), (0,2). Expected horizontal: (-1,1), (0,1), (1,1)
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(3);
  });
  it("should transform blinker from horizontal back to vertical (gen 1 → gen 2)", () => {
    // Horizontal blinker: (-1,1), (0,1), (1,1). Expected vertical: (0,0), (0,1), (0,2)
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toHaveLength(3);
  });
});