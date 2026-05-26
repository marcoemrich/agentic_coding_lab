import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation, 0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation, 1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives (rule 2 - survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with 3 neighbors survives (rule 2 - survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("live cell with 4 neighbors dies (rule 3 - overpopulation)", () => {
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (rule 4 - reproduction) — [(0,0),(1,0),(0,1)] produces (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("blinker vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sortKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(result.sort((a, b) => sortKey(a).localeCompare(sortKey(b))))
      .toEqual([[-1, 1], [0, 1], [1, 1]].sort((a, b) => sortKey(a as Cell).localeCompare(sortKey(b as Cell))));
  });
  it("handles negative coordinates correctly", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const sortKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(result.sort((a, b) => sortKey(a).localeCompare(sortKey(b))))
      .toEqual([[-6, -4], [-5, -4], [-4, -4]].sort((a, b) => sortKey(a as Cell).localeCompare(sortKey(b as Cell))));
  });
});
