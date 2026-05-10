import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return an empty grid when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell due to underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells due to underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged as a still life", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should kill cells with more than 3 live neighbors due to overpopulation", () => {
    // Input pattern: ### / .#. / ### — center (1,1) has 6 live neighbors → dies (overpopulation).
    // Surviving live cells: (0,0),(2,0) with 2 neighbors; (1,0),(1,2) with 3 neighbors; (0,2),(2,2) with 2 neighbors.
    // Born cells (dead with exactly 3 live neighbors): (1,-1) and (1,3).
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]]));
  });
  it("should bring a dead cell with exactly 3 live neighbors to life by reproduction", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
});
