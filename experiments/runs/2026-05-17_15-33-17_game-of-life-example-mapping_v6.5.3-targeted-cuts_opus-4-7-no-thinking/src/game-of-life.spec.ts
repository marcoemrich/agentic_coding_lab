import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives", () => {
    // Horizontal blinker: center (1,0) has 2 neighbors (0,0) and (2,0), survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with 4 neighbors dies from overpopulation", () => {
    // Plus shape: center (0,0) has 4 live neighbors → dies
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(result).not.toContainEqual([0, 0]);
  });
  it("dead cell with exactly 3 neighbors becomes alive", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors (0,0), (1,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block pattern (2x2) is stable", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("blinker oscillates from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("handles negative coordinates", () => {
    // Block at negative coords — should remain stable
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
});
