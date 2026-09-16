import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0) with zero neighbors -- returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps the live center cell (1,1) with exactly three neighbors alive", () => {
    const cells: [number, number][] = [[1, 1], [0, 0], [1, 0], [2, 0]];
    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("kills the live center cell (1,1) with exactly four neighbors", () => {
    const cells: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduces at dead cell (1,1) with exactly three neighbors -- forms a four-cell block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns the blinker back to its vertical state after two generations", () => {
    const afterTwo = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(afterTwo).toHaveLength(3);
    expect(afterTwo).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("evolves cells across negative x and y coordinates on the infinite grid", () => {
    const next = nextGeneration([[-2, -3], [-2, -2], [-2, -1]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-3, -2], [-2, -2], [-1, -2]]));
  });
});
