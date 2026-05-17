import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(block.map(([x, y]) => `${x},${y}`))
    );
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(3);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(expected.map(([x, y]) => `${x},${y}`))
    );
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(expected.map(([x, y]) => `${x},${y}`))
    );
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: [number, number][] = [[0, 0], [2, 0], [0, 2], [2, 2]];
    const result = nextGeneration(input);
    const resultKeys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultKeys.has("1,1")).toBe(false);
    for (const [x, y] of expected) {
      expect(resultKeys.has(`${x},${y}`)).toBe(true);
    }
  });
});
