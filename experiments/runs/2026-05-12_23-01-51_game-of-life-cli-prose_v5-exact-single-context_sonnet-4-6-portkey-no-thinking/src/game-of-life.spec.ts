import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty world when given empty world", () => {
    expect(nextGeneration([], 1)).toEqual([]);
  });
  it("should return same cells when steps is 0", () => {
    expect(nextGeneration([[1, 2], [3, 4]], 0)).toEqual([[1, 2], [3, 4]]);
  });
  it("should kill a lone cell with no neighbors after one step", () => {
    expect(nextGeneration([[5, 5]], 1)).toEqual([]);
  });
  it("should keep two cells that are neighbors of each other alive with a third when they form a stable trio (block)", () => {
    // 2x2 block: each cell has exactly 3 live neighbors → all survive, no new births outside
    expect(nextGeneration([[0,0],[0,1],[1,0],[1,1]], 1)).toEqual([[0,0],[0,1],[1,0],[1,1]]);
  });
  it("should evolve a blinker (three cells in a row) to its next generation (three cells in a column)", () => {
    // horizontal blinker: (0,0),(1,0),(2,0) → vertical blinker: (1,-1),(1,0),(1,1)
    expect(nextGeneration([[0,0],[1,0],[2,0]], 1)).toEqual([[1,-1],[1,0],[1,1]]);
  });
  it("should sort output cells lexicographically by x then y", () => {
    // steps=0 returns input unchanged but sorted; provide unsorted input
    expect(nextGeneration([[3,1],[1,2],[1,0],[-1,5]], 0)).toEqual([[-1,5],[1,0],[1,2],[3,1]]);
  });
});
