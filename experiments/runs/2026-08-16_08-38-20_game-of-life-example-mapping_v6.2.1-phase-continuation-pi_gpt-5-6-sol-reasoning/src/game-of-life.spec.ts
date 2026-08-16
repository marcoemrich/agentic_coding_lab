import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("single cell dies -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation kills adjacent pair -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduction makes a dead cell with exactly 3 neighbors alive -- [(0,1),(1,1),(0,0)] becomes [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("survival keeps a live cell with 2 or 3 neighbors alive -- center cell (1,1) remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]])).toContainEqual([1, 1]);
  });
  it("overpopulation kills a live cell with more than 3 neighbors -- center cell (1,1) is absent", () => {
    expect(nextGeneration([
      [0, 2], [1, 2], [2, 2], [0, 1], [1, 1], [2, 1], [0, 0], [1, 0], [2, 0],
    ])).not.toContainEqual([1, 1]);
  });
  it("block is a still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("blinker oscillates over two generations -- vertical [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)] then vertical", () => {
    const horizontal = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(horizontal).toEqual([[-1, 1], [0, 1], [1, 1]]);
    expect(nextGeneration(horizontal)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
