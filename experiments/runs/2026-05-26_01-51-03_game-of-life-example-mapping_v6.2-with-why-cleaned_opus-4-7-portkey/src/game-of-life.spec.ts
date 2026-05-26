import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent live cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: middle of a horizontal triple survives — (1,0) has 2 live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: center of 3x3 block dies — (1,1) has 8 live neighbors", () => {
    const fullBlock: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullBlock);
    expect(result).not.toContainEqual([1, 1]);
    expect(result).toContainEqual([0, 0]);
  });
  it("Rule 4 Reproduction: dead (1,1) with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → contains (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life is stable — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillates: vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(3);
    for (const cell of expected) {
      expect(result).toContainEqual(cell);
    }
  });
  it("handles negative coordinates (blinker at (-10,-10..-8)) — rotates to horizontal", () => {
    const result = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    const expected: [number, number][] = [[-11, -9], [-10, -9], [-9, -9]];
    expect(result).toHaveLength(3);
    for (const cell of expected) {
      expect(result).toContainEqual(cell);
    }
  });
});
