import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block alive (still life)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]] as Cell[]));
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]] as Cell[]));
  });
  it("should create a new cell from reproduction (dead cell with exactly 3 neighbors)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]] as Cell[]));
  });
  it("should kill a live cell with 4 neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should support negative coordinates", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]] as Cell[]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]] as Cell[]));
  });
});
