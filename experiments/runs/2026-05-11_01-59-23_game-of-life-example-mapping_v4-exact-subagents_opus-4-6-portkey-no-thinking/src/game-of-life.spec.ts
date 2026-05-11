import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  const sorted = (cells: number[][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block pattern unchanged (still life with 2-3 neighbors)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(sorted(result)).toEqual(sorted(block));
  });
  it("should oscillate a blinker from vertical to horizontal (reproduction and underpopulation)", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(sorted(result)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should oscillate a blinker from horizontal back to vertical", () => {
    const horizontal = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(horizontal);
    expect(sorted(result)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
