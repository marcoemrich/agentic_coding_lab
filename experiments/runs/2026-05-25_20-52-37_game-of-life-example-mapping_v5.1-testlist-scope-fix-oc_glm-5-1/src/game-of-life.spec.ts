import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty input -- []", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with 0 neighbors (Rule 1: underpopulation) -- [(0,0)] → []", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor (Rule 1: underpopulation, spec example) -- [(0,1),(1,1)] → []", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep alive a cell with exactly 2 neighbors (Rule 2: survival) -- [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep block unchanged with 3 neighbors each (Rule 2: survival, spec example) -- [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should kill center cell with 4+ neighbors (Rule 3: overpopulation, spec example) -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] → [(0,0),(1,0),(2,0),(0,2),(1,2),(2,2),(1,-1),(1,3)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]]));
  });
  it("should birth dead cell with exactly 3 neighbors (Rule 4: reproduction, spec example) -- [(0,1),(0,2),(1,2)] → [(0,1),(1,1),(0,2),(1,2)]", () => {
    const result = nextGeneration([[0, 1], [0, 2], [1, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 1], [1, 1], [0, 2], [1, 2]]));
  });
  it("should oscillate blinker from vertical to horizontal (pattern example) -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should handle negative coordinates correctly -- [(-1,-1)] → []", () => {
    const result = nextGeneration([[-1, -1]]);
    expect(result).toEqual([]);
  });
});
