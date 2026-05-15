import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("a live cell with 4 live neighbors dies (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 live neighbors
    const input: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors at (0,0), (1,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("a live cell with 2 or 3 live neighbors survives (survival)", () => {
    // Live cell (1,1) has 3 live neighbors: (0,0), (1,0), (2,0)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates between vertical and horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal = nextGeneration(vertical);
    expect(horizontal).toHaveLength(3);
    expect(horizontal).toContainEqual([-1, 1]);
    expect(horizontal).toContainEqual([0, 1]);
    expect(horizontal).toContainEqual([1, 1]);
  });
  it("block (still life) remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker at negative coordinates
    const vertical: [number, number][] = [[-10, -12], [-10, -11], [-10, -10]];
    const horizontal = nextGeneration(vertical);
    expect(horizontal).toHaveLength(3);
    expect(horizontal).toContainEqual([-11, -11]);
    expect(horizontal).toContainEqual([-10, -11]);
    expect(horizontal).toContainEqual([-9, -11]);
  });
});
