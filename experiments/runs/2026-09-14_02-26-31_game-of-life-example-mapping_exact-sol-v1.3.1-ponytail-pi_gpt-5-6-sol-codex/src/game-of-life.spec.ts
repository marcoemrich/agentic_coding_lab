import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("turns the single cell [(0,0)] into []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells in [(0,1),(1,1)] by underpopulation, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live cell with exactly 3 live neighbors alive", () => {
    expect(nextGeneration([[1, 0], [0, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });
  it("kills a live cell with 4 live neighbors by overpopulation", () => {
    const next = nextGeneration([[0, -1], [0, 0], [-1, 0], [1, 0], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces at dead cell (1,1) with exactly 3 neighbors, producing a 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("returns the horizontal blinker to [(0,0),(0,1),(0,2)] after another generation", () => {
    const next = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("evolves a blinker at negative coordinates with no finite-grid boundary", () => {
    const next = nextGeneration([[-10, -2], [-10, -1], [-10, 0]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-11, -1], [-10, -1], [-9, -1]]));
  });
});
