import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged (still-life)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("should rotate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("should kill the center of a filled 3x3 and produce corners-only pattern (overpopulation)", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([
        [0, 0], [2, 0], [0, 2], [2, 2],
        [-1, 1], [1, -1], [3, 1], [1, 3],
      ].map(c => c.join(",")))
    );
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("should handle negative coordinates correctly", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[-6, -4], [-5, -4], [-4, -4]].map(c => c.join(",")))
    );
  });
});
