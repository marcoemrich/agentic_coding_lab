import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells (both have only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("oscillates a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
  it("handles negative coordinates correctly", () => {
    // Block at negative coordinates - still life, should remain unchanged
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(nextGeneration(block).sort()).toEqual(block.sort());
  });
});
