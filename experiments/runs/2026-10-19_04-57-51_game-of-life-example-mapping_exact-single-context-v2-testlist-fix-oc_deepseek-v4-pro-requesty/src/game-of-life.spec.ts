import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill cells under underpopulation (Rule 1)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should preserve survival with 2 live neighbors (Rule 2)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual([[1, -1], [1, 0], [1, 1]]);
  });

  it("should kill an overpopulated center cell with 4 live neighbors (Rule 3)", () => {
    const gen0: Array<[number, number]> = [
      [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1],
    ];
    const result = nextGeneration(gen0);
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });

  it("should reproduce a dead cell with exactly 3 neighbors (Rule 4)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("should keep a block still life unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("should transform a blinker oscillator between horizontal and vertical", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it("should handle negative coordinates", () => {
    expect(nextGeneration([[-1, -1], [-1, 0], [-1, 1]])).toEqual([[-2, 0], [-1, 0], [0, 0]]);
  });
});