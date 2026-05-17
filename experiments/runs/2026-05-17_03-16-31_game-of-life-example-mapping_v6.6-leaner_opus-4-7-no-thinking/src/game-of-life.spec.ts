import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (2x2) stable (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should handle negative coordinates", () => {
    // Blinker at negative coords: (-5,-5),(-5,-4),(-5,-3) → (-6,-4),(-5,-4),(-4,-4)
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
