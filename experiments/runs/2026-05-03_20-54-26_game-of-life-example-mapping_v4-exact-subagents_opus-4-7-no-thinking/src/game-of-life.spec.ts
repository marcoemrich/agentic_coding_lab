// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Conway's Game of Life - Next Generation", () => {
  it("should return an empty grid when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep a block still life unchanged (each cell has 3 neighbors, survives)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should kill the center of a full 3x3 block due to overpopulation while corners survive", () => {
    // Gen 0: full 3x3 block of 9 live cells
    // Center (1,1) has 8 neighbors -> dies (overpopulation)
    // Edge cells (1,0),(0,1),(2,1),(1,2) have 5 neighbors -> die
    // Corner cells (0,0),(2,0),(0,2),(2,2) have 3 neighbors -> survive
    // Dead cells around: (1,-1),(-1,1),(3,1),(1,3) each have 3 live neighbors -> reproduce
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(sortCells(result)).toEqual(
      sortCells([
        [0, 0], [2, 0], [0, 2], [2, 2],
        [1, -1], [-1, 1], [3, 1], [1, 3],
      ]),
    );
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at negative coordinates should oscillate to horizontal blinker
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(result)).toEqual(sortCells([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
