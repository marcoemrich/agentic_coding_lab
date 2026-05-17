import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell with no neighbors dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("a live cell with 2 live neighbors survives", () => {
    // Three cells in a row: the middle cell has 2 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("a live cell with more than 3 live neighbors dies (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors (N, S, E, W) → dies
    const result = nextGeneration([
      [1, 0], [0, 1], [1, 1], [2, 1], [1, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-tromino: (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("a block (2x2) is a still life and remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("a vertical blinker becomes horizontal in the next generation", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker at negative coords -> horizontal blinker
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
