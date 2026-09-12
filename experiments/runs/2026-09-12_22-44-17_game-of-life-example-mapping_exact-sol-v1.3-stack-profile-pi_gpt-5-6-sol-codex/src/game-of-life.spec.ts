import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells by underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("lets live cells with two neighbors survive -- a three-cell corner becomes a four-cell block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("lets a live cell with three neighbors survive -- a T shape becomes seven cells", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1],
    ]);
  });
  it("kills an overpopulated center cell -- the seven-cell example becomes eight cells", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0],
      [0, 2], [1, 2], [2, 2], [1, 3],
    ]);
  });
  it("reproduces a dead cell with exactly three neighbors -- the three-cell corner becomes a block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("oscillates a vertical blinker horizontally -- [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("oscillates a blinker back after two generations -- [(0,0),(0,1),(0,2)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(vertical))).toEqual(vertical);
  });
  it("handles negative coordinates on the infinite grid -- a negative block is unchanged", () => {
    const block: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expect(nextGeneration(block)).toEqual(block);
  });
});
