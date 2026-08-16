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
  it("reproduces at dead cell (1,1) with exactly three neighbors in [(0,1),(1,0),(0,0)], producing the 2x2 block [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 0], [0, 0]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps center cell (1,1) alive with three neighbors in [(0,2),(1,2),(2,2),(1,1)]", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills center cell (1,1) with four neighbors in [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged as a still life", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("oscillates blinker [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)] and back after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
  it("handles an infinite sparse grid across negative coordinates by evolving [(-2,-1),(-1,-1),(0,-1)] to [(-1,-2),(-1,-1),(-1,0)]", () => {
    expect(nextGeneration([[-2, -1], [-1, -1], [0, -1]])).toEqual([
      [-1, -2], [-1, -1], [-1, 0],
    ]);
  });
});
