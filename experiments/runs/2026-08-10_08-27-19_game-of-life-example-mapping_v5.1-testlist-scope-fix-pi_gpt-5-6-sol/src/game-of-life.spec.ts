import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] when the current generation is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells at (0,1) and (1,1), producing [] by underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps a live cell with exactly 3 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("kills center cell (1,1) with more than 3 live neighbors by overpopulation", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).not.toContainEqual([1, 1]);
  });
  it("makes dead cell (1,1) alive from L-shape [(0,0),(1,0),(0,1)], producing a four-cell block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("rotates blinker [(0,0),(0,1),(0,2)] horizontally and back vertically", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
  it("rotates a blinker across negative coordinates on the infinite grid", () => {
    expect(nextGeneration([[-2, -1], [-2, 0], [-2, 1]])).toEqual([
      [-3, 0], [-2, 0], [-1, 0],
    ]);
  });
});
