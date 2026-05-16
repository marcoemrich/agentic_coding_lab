import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - nextGeneration", () => {
  it("returns an empty array when given an empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a 2x2 block remains stable (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("a vertical blinker becomes horizontal (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
  it("a live cell with more than 3 neighbors dies (overpopulation)", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    // Center (1,1) has 8 live neighbors → dies (overpopulation).
    // Corners survive with 2 neighbors; edge-middles (1,0) and (1,2) survive with 3.
    // (1,-1) and (1,3) are born (each has exactly 3 live neighbors).
    const expected: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 2], [1, 2], [2, 2],
      [1, -1], [1, 3],
    ];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
  it("works with negative coordinates", () => {
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
});
