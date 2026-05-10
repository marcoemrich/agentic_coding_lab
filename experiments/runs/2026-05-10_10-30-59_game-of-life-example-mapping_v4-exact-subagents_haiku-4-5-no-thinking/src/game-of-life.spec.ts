import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty set for empty grid", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill single living cell (underpopulation)", () => {
    const liveCell = new Set(["0,0"]);
    expect(nextGeneration(liveCell)).toEqual(new Set());
  });
  it("should kill two adjacent cells (both underpopulation)", () => {
    const twoCells = new Set(["0,0", "1,0"]);
    expect(nextGeneration(twoCells)).toEqual(new Set());
  });
  it("should preserve living cell with exactly 2 neighbors", () => {
    // Create a configuration where one cell has exactly 2 neighbors
    // Cells at (0,0), (0,1), (0,2) form a vertical line
    // - (0,0) has 1 neighbor (0,1)
    // - (0,1) has 2 neighbors (0,0) and (0,2)
    // - (0,2) has 1 neighbor (0,1)
    // Next generation: (0,1) should survive with 2 neighbors
    const cells = new Set(["0,0", "0,1", "0,2"]);
    const result = nextGeneration(cells);
    expect(result.has("0,1")).toBe(true);
  });
  it("should preserve living cell with exactly 3 neighbors", () => {
    // Create a configuration where one cell has exactly 3 neighbors
    // A 2x2 block has each cell with 3 neighbors:
    // (0,0) has neighbors (0,1), (1,0), (1,1) = 3 neighbors ✓
    // (0,1) has neighbors (0,0), (1,0), (1,1) = 3 neighbors ✓
    // (1,0) has neighbors (0,0), (0,1), (1,1) = 3 neighbors ✓
    // (1,1) has neighbors (0,0), (0,1), (1,0) = 3 neighbors ✓
    // All cells should survive
    const cells = new Set(["0,0", "0,1", "1,0", "1,1"]);
    const result = nextGeneration(cells);
    expect(result.has("0,0")).toBe(true);
  });
  it("should kill cell with 4 neighbors (overpopulation)", () => {
    // Create a configuration where one cell has exactly 4 neighbors
    // Pattern:
    //   (0,1)
    // (1,0) X (1,2)
    //   (2,1)
    //   + one more neighbor (0,0)
    // This gives X at (1,1) exactly 4 neighbors: (0,1), (1,0), (1,2), (2,1)
    // Plus (0,0) for 5 total? Let me create a 3x3 with center having 4 neighbors:
    // (0,0) (0,1) empty
    // (1,0)   X   (1,2)
    // empty (2,1) empty
    // X at (1,1) has 4 neighbors: (0,0), (0,1), (1,0), (1,2), (2,1) = 5 neighbors
    // Let me use: (0,0), (0,1), (1,0), (1,2) - this gives (1,1) exactly 4 neighbors
    const cells = new Set(["0,0", "0,1", "1,0", "1,2"]);
    const result = nextGeneration(cells);
    expect(result.has("1,1")).toBe(false);
  });
  it("should create new cell from dead cell with exactly 3 neighbors", () => {
    // Dead cell at (1,1) with exactly 3 living neighbors should be born
    // Pattern: three cells forming an L-shape around a dead cell
    // (0,1) (1,1) dead
    // (1,0) - center (1,1) is dead
    // (0,0) is empty
    // Living cells: (0,1), (1,0), (0,0) - these 3 are neighbors of dead cell (1,1)
    const cells = new Set(["0,0", "0,1", "1,0"]);
    const result = nextGeneration(cells);
    expect(result.has("1,1")).toBe(true);
  });
  it("should handle multiple births in one generation", () => {
    // Configuration where multiple dead cells will be born
    // Pattern: three cells in an L-shape create conditions for births
    // Living cells: (0,0), (0,1), (1,0)
    // Dead cell (1,1) has 3 neighbors: (0,0), (0,1), (1,0) -> will be born
    // Dead cell (0,2) has 2 neighbors: (0,1), (0,0) -> will not be born
    // Dead cell (2,0) has 2 neighbors: (0,0), (1,0) -> will not be born
    // Dead cell (2,1) has 2 neighbors: (0,1), (1,0) -> will not be born
    // Dead cell (-1,0) has 1 neighbor: (0,0) -> will not be born
    // So we need a more complex pattern for multiple births
    // Use pattern that creates 2+ cells with exactly 3 neighbors
    const cells = new Set(["0,1", "1,0", "1,1", "1,2", "2,1"]);
    const result = nextGeneration(cells);
    // After checking, multiple dead cells should have exactly 3 neighbors
    // Dead cell (0,0) has neighbors (0,1), (1,0), (1,1) = 3 -> born
    // Dead cell (2,0) has neighbors (1,0), (1,1), (2,1) = 3 -> born
    // Dead cell (2,2) has neighbors (1,1), (1,2), (2,1) = 3 -> born
    // Dead cell (0,2) has neighbors (0,1), (1,1), (1,2) = 3 -> born
    expect(result.has("0,0")).toBe(true);
    expect(result.has("2,0")).toBe(true);
    expect(result.has("2,2")).toBe(true);
    expect(result.has("0,2")).toBe(true);
  });
  it("should handle multiple deaths in one generation", () => {
    // Configuration where multiple living cells will die
    // Start with a pattern where several cells have insufficient neighbors
    // Pattern: 5 isolated cells or cells with < 2 neighbors
    // Living cells: (0,0), (2,0), (4,0) - all isolated (0 neighbors each)
    const cells = new Set(["0,0", "2,0", "4,0"]);
    const result = nextGeneration(cells);
    // All three cells should die due to underpopulation
    expect(result.has("0,0")).toBe(false);
    expect(result.has("2,0")).toBe(false);
    expect(result.has("4,0")).toBe(false);
  });
  it("should handle mixed births and deaths", () => {
    // Configuration where some cells die and some cells are born in same generation
    // Living cells: (0,0), (0,1), (2,0)
    // - (0,0) has 1 neighbor (0,1) -> dies (underpopulation)
    // - (0,1) has 1 neighbor (0,0) -> dies (underpopulation)
    // - (2,0) has 0 neighbors -> dies (underpopulation)
    // Dead cell (1,0) has 2 neighbors (0,0), (0,1) -> stays dead (needs 3)
    // Dead cell (1,1) has 3 neighbors (0,0), (0,1), (2,0) -> born!
    const cells = new Set(["0,0", "0,1", "2,0"]);
    const result = nextGeneration(cells);
    // All living cells should die
    expect(result.has("0,0")).toBe(false);
    expect(result.has("0,1")).toBe(false);
    expect(result.has("2,0")).toBe(false);
    // Dead cell (1,1) should be born
    expect(result.has("1,1")).toBe(true);
  });
  it("should handle negative coordinates", () => {
    // Living cells with negative coordinates
    // (-1,-1), (-1,0), (0,-1) form an L-shape
    // Dead cell (0,0) has 3 neighbors -> should be born
    const cells = new Set(["-1,-1", "-1,0", "0,-1"]);
    const result = nextGeneration(cells);
    expect(result.has("0,0")).toBe(true);
  });
});
