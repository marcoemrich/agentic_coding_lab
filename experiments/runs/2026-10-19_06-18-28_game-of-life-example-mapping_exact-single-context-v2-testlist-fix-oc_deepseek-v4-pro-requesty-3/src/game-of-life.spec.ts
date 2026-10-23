import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for a single live cell (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only 1 neighbor (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep live cell with exactly 2 live neighbors (survival) -- line [(0,0),(1,0),(2,0)] -> [(1,-1),(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep live cell with exactly 3 live neighbors (survival) -- block corner (0,0) with 3 neighbors survives", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toContainEqual([0, 0]);
  });
  it("should kill live cell with more than 3 live neighbors (overpopulation) -- plus shape center dies", () => {
    const plus: Cell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    expect(sorted(nextGeneration(plus))).toEqual(
      [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]
    );
  });
  it("should revive dead cell with exactly 3 live neighbors (reproduction) -- [(0,0),(1,0),(0,1)] -> block [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should produce next generation for a blinker (oscillator) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should keep a block stable (still life) -- [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should handle negative coordinates -- blinker shifted to negative quadrant", () => {
    expect(sorted(nextGeneration([[-5, -5], [-5, -4], [-5, -3]]))).toEqual([[-6, -4], [-5, -4], [-4, -4]]);
  });
});