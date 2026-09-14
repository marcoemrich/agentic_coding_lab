import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell [(0,0)] dies to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: adjacent pair [(0,1),(1,1)] dies to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: a live cell with exactly 2 neighbors remains alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("survival example: live center (1,1) with exactly 3 neighbors remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("overpopulation example: center (1,1) with more than 3 neighbors dies", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction example: [(0,1),(1,1),(0,0)] becomes the four-cell block", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const next = nextGeneration(block);
    expect(next).toHaveLength(block.length);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("blinker Gen 0 becomes Gen 1, including negative x coordinates", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("blinker Gen 1 becomes Gen 2", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
});
