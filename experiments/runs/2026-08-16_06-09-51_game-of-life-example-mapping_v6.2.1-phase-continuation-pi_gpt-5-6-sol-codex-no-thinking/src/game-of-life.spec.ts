import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0) by underpopulation -- expected []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each by underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with two or three neighbors alive -- the center of a three-cell line survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("kills a live cell with more than three neighbors -- the center of a five-cell cross is absent from the result", () => {
    const next = nextGeneration([[0, 0], [0, -1], [1, 0], [0, 1], [-1, 0]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,0),(1,0),(0,1)] becomes a 2x2 block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toHaveLength(4);
  });
  it("oscillates a blinker and handles negative coordinates -- vertical becomes [(-1,1),(0,1),(1,1)] and back", () => {
    const horizontal = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(horizontal).toEqual([[-1, 1], [0, 1], [1, 1]]);
    expect(nextGeneration(horizontal)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("keeps the block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
});
