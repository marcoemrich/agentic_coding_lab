import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (2x2) alive as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.slice().sort()).toEqual(block.slice().sort());
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.slice().sort()).toEqual(horizontal.slice().sort());
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // Three cells in an L-shape; the dead cell at (1,1) has exactly 3 live neighbors and becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result.slice().sort()).toEqual(expected.slice().sort());
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // 3x3 full grid: center (1,1) has 8 live neighbors → dies (overpopulation)
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at negative coordinates
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(vertical);
    expect(result.slice().sort()).toEqual(horizontal.slice().sort());
  });
});
