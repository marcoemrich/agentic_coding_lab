import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block pattern alive where each cell has exactly 3 neighbors (survival)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sort = (cells: number[][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(result).toHaveLength(4);
    expect(sort(result)).toEqual(sort(block));
  });
  it("should evolve a blinker from vertical to horizontal (reproduction and underpopulation)", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const sort = (cells: number[][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
});
