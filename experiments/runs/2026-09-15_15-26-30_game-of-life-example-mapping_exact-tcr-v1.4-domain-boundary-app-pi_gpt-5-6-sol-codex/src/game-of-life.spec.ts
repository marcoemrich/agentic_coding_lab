import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation -- no living cells are tracked", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the single cell at (0,0) -- next generation is []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive -- survival rule", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps center (1,1) alive with exactly three live neighbors -- survival example", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("makes dead center (1,1) alive with exactly three live neighbors -- reproduction example produces [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toHaveLength(4);
  });
  it("kills center (1,1) with more than three live neighbors -- overpopulation rule", () => {
    const next = nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("keeps the 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)] -- negative coordinates are supported", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(next).toHaveLength(3);
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)] -- generation two oscillates", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(next).toHaveLength(3);
  });
});
