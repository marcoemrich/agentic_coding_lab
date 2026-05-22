import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return [] for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return [] for a single live cell at (0,0) — dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return [] for two adjacent live cells [(0,1),(1,1)] — both die from underpopulation (Rule 1)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep block [(0,0),(1,0),(0,1),(1,1)] unchanged — still life (Rule 2)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should kill center cell of fully surrounded 3x3 — overpopulation (Rule 3): full 3x3 → corners + plus-extensions, no (1,1)", () => {
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 0], [2, 0], [0, 2], [2, 2],
      [-1, 1], [1, -1], [3, 1], [1, 3],
    ];
    const result = nextGeneration(input);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring dead cell (1,1) to life with exactly 3 live neighbors (Rule 4)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should oscillate vertical blinker [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should handle negative coordinates: blinker at [(-1,-1),(-1,0),(-1,1)] → [(-2,0),(-1,0),(0,0)]", () => {
    const result = nextGeneration([[-1, -1], [-1, 0], [-1, 1]]);
    const expected: Cell[] = [[-2, 0], [-1, 0], [0, 0]];
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
