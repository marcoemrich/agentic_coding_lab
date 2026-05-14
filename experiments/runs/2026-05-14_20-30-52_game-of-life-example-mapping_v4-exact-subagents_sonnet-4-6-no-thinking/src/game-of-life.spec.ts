import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty array for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block of four cells alive (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    expect(nextGeneration(gen0)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // 3x3 block: center cell (1,1) has 8 live neighbors -> dies from overpopulation
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    const hasCenter = result.some(([r, c]) => r === 1 && c === 1);
    expect(hasCenter).toBe(false);
  });
  it("should transform a blinker to its next generation (oscillator)", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(gen0)).toEqual(gen1);
  });
});
