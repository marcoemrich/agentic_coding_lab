import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array when given an empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) as a still life", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(input.map((c) => `${c[0]},${c[1]}`))
    );
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(expected.map((c) => `${c[0]},${c[1]}`))
    );
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const keys = new Set(result.map((c) => `${c[0]},${c[1]}`));
    expect(keys.has("1,1")).toBe(true);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors: (0,1), (1,0), (1,2), (2,1) → dies
    const input: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = nextGeneration(input);
    const keys = new Set(result.map((c) => `${c[0]},${c[1]}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker at (-10, -10..-8) becomes horizontal at (-11..-9, -9)
    const input: [number, number][] = [[-10, -10], [-10, -9], [-10, -8]];
    const expected: [number, number][] = [[-11, -9], [-10, -9], [-9, -9]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(expected.map((c) => `${c[0]},${c[1]}`))
    );
  });
});
