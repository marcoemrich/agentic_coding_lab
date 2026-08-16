import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns no living cells for an empty generation -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell through underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells that each have one neighbor -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with two live neighbors alive -- the survival rule", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps a live cell with three live neighbors alive -- center (1,1) survives", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than three live neighbors -- center (1,1) dies", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("creates a dead cell with exactly three live neighbors -- (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("keeps the block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns a vertical blinker into a horizontal blinker -- [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns the horizontal blinker back into the vertical blinker after a second generation", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(vertical))).toEqual(vertical);
  });
  it("applies the rules beyond the positive quadrant -- a negative-coordinate block is unchanged", () => {
    const block: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expect(nextGeneration(block)).toEqual(block);
  });
});
