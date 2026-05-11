import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block pattern alive where each cell has exactly 3 neighbors (survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const plus: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const liveCells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(liveCells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should evolve a blinker from vertical to horizontal (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});
