import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("a block (2x2) is a still life and remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
  it("a blinker rotates from vertical to horizontal (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const cellStrings = new Set(result.map(c => c.join(",")));
    expect(cellStrings.has("1,1")).toBe(true);
  });
  it("a live cell with more than 3 live neighbors dies (overpopulation)", () => {
    // 3x3 filled block: center (1,1) has 8 live neighbors → dies.
    const filled: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(filled);
    const cellStrings = new Set(result.map(c => c.join(",")));
    expect(cellStrings.has("1,1")).toBe(false);
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker shifted to negative coordinates.
    const vertical: [number, number][] = [[-10, -10], [-10, -9], [-10, -8]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[-11, -9], [-10, -9], [-9, -9]].map(c => c.join(",")))
    );
  });
});
