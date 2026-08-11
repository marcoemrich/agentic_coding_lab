import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("should return [] for an empty grid []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell [(0,0)] with 0 neighbors → [] (Rule 1: underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill both cells of a pair [(0,1), (1,1)], each with 1 neighbor → [] (Rule 1: underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with 2 neighbors alive: (1,1) of [(0,0), (1,0), (1,1)] survives (Rule 2: survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a live cell with 3 neighbors alive: (1,1) of [(0,0), (1,0), (2,0), (1,1)] survives (Rule 2: survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with 4 neighbors: center (1,1) of [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)] dies (Rule 3: overpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should revive a dead cell with exactly 3 neighbors: (1,1) with neighbors [(0,0), (1,0), (0,1)] becomes alive (Rule 4: reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should transform [(0,0), (1,0), (0,1)] into [(0,0), (1,0), (0,1), (1,1)] (Rule 4 example: full block emerges)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should leave the block [(0,0), (1,0), (0,1), (1,1)] unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should transform the vertical blinker [(0,0), (0,1), (0,2)] into the horizontal blinker [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should transform the horizontal blinker [(-1,1), (0,1), (1,1)] back into the vertical blinker [(0,0), (0,1), (0,2)] (oscillation period 2)", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [0, 1], [0, 2]]));
  });
  it("should handle negative coordinates: blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(result)).toEqual(sortCells([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
