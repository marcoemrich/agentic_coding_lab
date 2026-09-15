import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns [] when the current generation has no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell at (0,0) by underpopulation -- returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells at (0,1) and (1,1), each with one neighbor -- returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps the example's center cell (1,1) with exactly three live neighbors alive", () => {
    const next = nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills the example's center cell (1,1) with four live neighbors by overpopulation", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell at (1,1) with exactly three neighbors -- returns the 2x2 block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("evolves the vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("evolves the blinker for a second generation back to [(0,0),(0,1),(0,2)]", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const second = nextGeneration(first);

    expect(second).toHaveLength(3);
    expect(second).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("handles negative x and y coordinates on the infinite grid", () => {
    const next = nextGeneration([[-2, -3], [-2, -2], [-2, -1]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-3, -2], [-2, -2], [-1, -2]]));
  });
});
