import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Rule examples (simple → complex)
  it("should return empty for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, 1 neighbor each)", () => {
    expect(nextGeneration([[0, 0], [0, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 or 3 live neighbors (survival)", () => {
    // Pattern: ### on top row, .#. on bottom row
    // Cell (1,0) is live with 2 live neighbors (0,0) and (2,0) → survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Gen 0: full 3x3 except center is dead
    // ###
    // .#.   wait - actually:
    // ###
    // Cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Center (1,1) has 6 live neighbors → dies (overpopulation)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Gen 0:       Gen 1:
    //  ##.          ##.
    //  #..    →     ##.
    //  ...          ...
    // Dead cell (1,1) has exactly 3 live neighbors (0,0),(1,0),(0,1) → becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Pattern examples
  it("should keep a block pattern unchanged (still life)", () => {
    // Block pattern: 2x2 square is a still life
    // Gen 0:       Gen 1:
    //  ##           ##
    //  ##    →      ##
    // All 4 cells have 3 live neighbors → survive
    // No dead cell has exactly 3 live neighbors → no births
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    // Gen 0 (vertical blinker): [(0,0), (0,1), (0,2)]
    // Gen 1 (horizontal blinker): [(-1,1), (0,1), (1,1)]
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([[-1, 1], [0, 1], [1, 1]])
    );
  });
});
