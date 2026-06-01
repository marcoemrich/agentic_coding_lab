import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("a pair of live cells both die (1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] stays", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("survival: a live cell with exactly 2 live neighbors lives on", () => {
    // (0,0) has live neighbors (1,0) and (0,1) → 2 neighbors → survives
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toEqual(expect.arrayContaining([[0, 0]]));
  });
  it("overpopulation: a live cell with more than 3 neighbors dies", () => {
    // Center (1,1) has 4 live neighbors (the four corners) → dies
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("reproduction: a dead cell with exactly 3 neighbors becomes alive — adds (1,1)", () => {
    // Dead cell (1,1) has exactly 3 live neighbors: (0,0),(1,0),(0,1) → born
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
