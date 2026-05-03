import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return an empty grid when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged (still life)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should kill cells with more than 3 neighbors and revive corners in a full 3x3 block", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).toHaveLength(8);
    expect(result).toEqual(expect.arrayContaining([
      [0, 0], [2, 0], [0, 2], [2, 2],
      [1, -1], [-1, 1], [3, 1], [1, 3],
    ]));
  });
  it("should support negative coordinates on the infinite grid", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
