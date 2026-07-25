import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns no living cells for an empty generation -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the single-cell example through underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells in the underpopulation example -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell with exactly three neighbors in the survival example -- (1,1) remains alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("kills the center cell with four neighbors in the overpopulation example -- (1,1) is absent", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces into the dead cell in the reproduction example -- (1,1) becomes alive", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("keeps the block still-life example unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(block.length);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("advances the blinker example from vertical to horizontal, including negative coordinates -- [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("advances the blinker example a second time back to vertical -- [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
