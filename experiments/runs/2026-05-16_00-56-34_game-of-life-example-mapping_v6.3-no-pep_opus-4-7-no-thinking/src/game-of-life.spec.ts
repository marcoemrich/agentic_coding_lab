import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep block pattern unchanged (still life with 3 neighbors each)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should oscillate blinker pattern (vertical to horizontal)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
  it("should kill overpopulated cell (more than 3 neighbors)", () => {
    // Full 3x3 grid: center (1,1) has 8 neighbors, dies from overpopulation
    const grid: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(grid);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("should birth a dead cell with exactly 3 neighbors (reproduction)", () => {
    // L-shape from spec: dead (1,1) has exactly 3 live neighbors -> born
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    // Blinker shifted to negative coords: vertical at x=-5 becomes horizontal
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"])
    );
  });
});
