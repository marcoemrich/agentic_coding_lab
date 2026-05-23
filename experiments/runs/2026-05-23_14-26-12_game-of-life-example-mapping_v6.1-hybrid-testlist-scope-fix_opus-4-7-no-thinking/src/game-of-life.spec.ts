import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Single cell dies: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 - Underpopulation: two adjacent cells [(0,1), (1,1)] (each has 1 neighbor) → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("Rule 4 - Reproduction: L-shape [(0,0), (1,0), (0,1)] becomes block (dead cell (1,1) has 3 neighbors → born)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });

  it("Block (still life): [(0,0), (1,0), (0,1), (1,1)] remains unchanged", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(input.map(c => c.join(",")))
    );
  });

  it("Rule 3 - Overpopulation: top and bottom rows plus center → center (1,1) dies (has 6 neighbors)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(input);
    const resultKeys = new Set(result.map(c => c.join(",")));
    expect(resultKeys.has("1,1")).toBe(false);
  });

  it("Blinker (oscillator): vertical [(0,0), (0,1), (0,2)] → horizontal [(-1,1), (0,1), (1,1)] (handles negative coordinates)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
});
