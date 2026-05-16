import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has 1 neighbor, underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a block (2x2) alive unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("brings a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("kills a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors and should die
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2],         [2, 2],
    ];
    const result = nextGeneration(input);
    const keys = new Set(result.map(c => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("handles negative coordinates correctly", () => {
    // Block at negative coordinates - still life
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(block);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
});
