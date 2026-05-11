import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty set when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have only 1 neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 live neighbors (survival)", () => {
    // Diagonal: (0,0),(1,1),(2,2). Middle has 2 neighbors → survives.
    // Outer cells have only 1 neighbor → die.
    // No dead cell has exactly 3 neighbors → no births.
    expect(nextGeneration([[0, 0], [1, 1], [2, 2]])).toEqual([[1, 1]]);
  });
  it("should keep a live cell alive when it has 3 live neighbors (survival)", () => {
    // L-tromino + extra: (1,0) has 3 neighbors → survives.
    // (0,0) has 1 → dies. (2,0),(2,1) each have 2 → survive.
    // Dead cell (1,-1) has 3 live neighbors → reproduces.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [2, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[1, 0], [2, 0], [2, 1], [1, -1]]));
  });
  it("should kill a live cell with 4 live neighbors (overpopulation)", () => {
    // Plus pattern: center (1,1) has 4 live neighbors → dies.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (1,1) is dead with 3 live neighbors → becomes alive.
    // Result is a block (all 4 cells alive).
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(sortCells(result)).toEqual(sortCells(block));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("should handle negative coordinates correctly", () => {
    // Block at negative coordinates — should remain unchanged.
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
