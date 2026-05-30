import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty array — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation, 0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives (Rule 2 - Survival) — blinker center stays alive", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("live cell with 4 neighbors dies (Rule 3 - Overpopulation) — center of '###/.#./###' dies", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (Rule 4 - Reproduction) — '##./#../...' → '##./##./...'", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("blinker oscillator vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-6, -4]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
