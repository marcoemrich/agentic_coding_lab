import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation, 1 neighbor each) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives (blinker center) — center of [(0,0),(0,1),(0,2)] survives at (0,1)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("live cell with 3 neighbors survives — corner of block has 3 neighbors and survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("live cell with 4 neighbors dies (overpopulation) — center of T-shape dies", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — [(0,0),(1,0),(0,1)] produces (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates — blinker at negative coords oscillates", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-6, -4]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
