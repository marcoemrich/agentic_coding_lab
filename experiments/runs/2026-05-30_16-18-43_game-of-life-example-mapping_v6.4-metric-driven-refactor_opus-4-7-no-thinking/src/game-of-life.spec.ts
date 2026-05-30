import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation, 1 neighbor each) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("live cell with >3 neighbors dies (overpopulation) — center of ### / .#. / ### dies", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — L-shape produces new cell at (1,1)", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
  it("handles negative coordinates — block at negative coords unchanged", () => {
    const negBlock: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(negBlock);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(negBlock));
  });
});
