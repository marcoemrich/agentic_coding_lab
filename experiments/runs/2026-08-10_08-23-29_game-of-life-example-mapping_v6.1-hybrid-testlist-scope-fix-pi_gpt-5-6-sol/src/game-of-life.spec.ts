import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at [(0,0)] by underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells at [(0,1),(1,1)] by underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("keeps a live cell with exactly 3 live neighbors alive, as in the survival example", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than 3 live neighbors, as in the overpopulation example", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).not.toContainEqual([1, 1]);
  });
  it("creates the dead cell (1,1) with exactly 3 neighbors -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the blinker back to its original state after two generations", () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(initial))).toEqual(
      expect.arrayContaining(initial),
    );
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("evolves cells across negative coordinates on the infinite grid", () => {
    expect(nextGeneration([[-2, -3], [-2, -2], [-2, -1]])).toEqual([
      [-3, -2], [-2, -2], [-1, -2],
    ]);
  });
});
