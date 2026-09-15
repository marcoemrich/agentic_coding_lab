import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell [(0,0)] dies from underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("adjacent cells [(0,1),(1,1)] each have one neighbor and die, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly two live neighbors survives", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("a live center cell (1,1) with three neighbors survives", () => {
    expect(nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]])).toContainEqual([1, 1]);
  });
  it("a live cell with four live neighbors dies from overpopulation", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("the reproduction example [(0,1),(1,1),(0,0)] produces the block [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("blinker [(0,0),(0,1),(0,2)] produces [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("a blinker returns to [(0,0),(0,1),(0,2)] after two generations", () => {
    const firstGeneration = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(nextGeneration(firstGeneration)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(nextGeneration(block)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
