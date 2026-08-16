import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at [(0,0)] by underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells [(0,1),(1,1)] with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell with exactly 2 live neighbors alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("keeps a live center cell with exactly 3 live neighbors alive", () => {
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("kills a live center cell with more than 3 live neighbors", () => {
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell at (1,1) with exactly 3 neighbors in [(0,0),(1,0),(0,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] horizontal, then vertical again", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const first = nextGeneration(vertical);
    expect(first).toEqual(expect.arrayContaining(horizontal));
    expect(first).toHaveLength(3);
    const second = nextGeneration(first);
    expect(second).toEqual(expect.arrayContaining(vertical));
    expect(second).toHaveLength(3);
  });
  it("evolves cells correctly across negative coordinates on the infinite sparse grid", () => {
    const result = nextGeneration([[-2, -2], [-2, -1], [-2, 0]]);
    const expected: [number, number][] = [[-3, -1], [-2, -1], [-1, -1]];
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(3);
  });
});
