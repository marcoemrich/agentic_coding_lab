import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a cell with exactly two neighbors (survival)", () => {
    // Three cells in a vertical line: center cell (1,1) has 2 neighbors → survives
    expect(sorted(nextGeneration([[0, 1], [1, 1], [2, 1]]))).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("should keep alive a cell with exactly three neighbors (survival)", () => {
    // T-shape: cell (1,0) has 3 neighbors → survives
    expect(sorted(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]))).toEqual([[0, 0], [0, 1], [1, -1], [1, 0], [1, 1], [2, 0], [2, 1]]);
  });
  it("should kill a cell with more than three neighbors (overpopulation)", () => {
    // Plus shape: center cell (1,1) has 4 neighbors → dies
    expect(sorted(nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]))).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors → becomes alive
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a block pattern stable across a generation (still life)", () => {
    // 2x2 block: each cell has 3 neighbors → all survive, no births
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
