import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a lone live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two neighbors alive -- the middle of a three-cell line survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps a live cell with exactly three neighbors alive -- (1,1) remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than three neighbors -- (1,1) with four neighbors is absent", () => {
    expect(nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    const result = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("evolves a vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("evolves the horizontal blinker back into [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("leaves the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("handles negative coordinates on the infinite grid -- a negative vertical blinker becomes horizontal", () => {
    const result = nextGeneration([[-2, -2], [-2, -1], [-2, 0]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-3, -1], [-2, -1], [-1, -1]]));
  });
  it("tracks living coordinates as cells rather than duplicate entries -- duplicate input coordinates do not alter evolution", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
});
