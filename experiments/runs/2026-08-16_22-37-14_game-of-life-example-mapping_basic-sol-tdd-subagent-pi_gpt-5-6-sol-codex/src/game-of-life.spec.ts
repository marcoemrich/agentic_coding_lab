import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell at (0,0) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills adjacent cells at (0,1) and (1,1) by underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps center cell (1,1) with exactly three neighbors alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills center cell (1,1) with exactly four neighbors", () => {
    expect(nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("births dead cell (1,1) with exactly three neighbors -- specified 2x2 block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as const;
    expect(nextGeneration(block.map((cell) => [...cell]))).toEqual(block);
  });
  it("rotates a vertical blinker horizontally and back after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal = nextGeneration(vertical);
    expect(new Set(horizontal.map(String))).toEqual(new Set(["-1,1", "0,1", "1,1"]));

    expect(new Set(nextGeneration(horizontal).map(String))).toEqual(
      new Set(["0,0", "0,1", "0,2"]),
    );
  });
  it("evolves a blinker across negative coordinates on the infinite grid", () => {
    const next = nextGeneration([[-2, -1], [-2, 0], [-2, 1]]);
    expect(new Set(next.map(String))).toEqual(new Set(["-3,0", "-2,0", "-1,0"]));
  });
});
