import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty array -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with 0 neighbors (Rule 1: underpopulation) -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor (Rule 1: underpopulation) -- [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a cell with exactly 2 neighbors (Rule 2: survival) -- L-shape becomes block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep alive a cell with exactly 3 neighbors (Rule 2: survival) -- block cells each have 3 neighbors", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should kill a cell with more than 3 neighbors (Rule 3: overpopulation) -- center of plus pattern dies", () => {
    const plus: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([1, 1]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]));
  });
  it("should birth a dead cell with exactly 3 neighbors (Rule 4: reproduction) -- [(0,2),(1,2),(0,1)] births (1,1)", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should leave a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should oscillate a blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should handle negative coordinates correctly -- cells at negative x/y", () => {
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
    const single: [number, number][] = [[-3, -5]];
    expect(nextGeneration(single)).toEqual([]);
  });
});
