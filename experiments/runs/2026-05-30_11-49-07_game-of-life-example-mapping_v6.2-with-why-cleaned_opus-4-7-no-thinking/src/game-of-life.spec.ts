import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — L-shape produces filled corner", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(lShape);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("live cell with 4 neighbors dies (overpopulation) — center of filled 3x3 dies", () => {
    const top: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const middle: [number, number][] = [[1, 1]];
    const bottom: [number, number][] = [[0, 2], [1, 2], [2, 2]];
    const input = [...top, ...middle, ...bottom];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly — vertical blinker at x=-5 → horizontal at y=0", () => {
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const expectedHorizontal: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expectedHorizontal));
  });
});
