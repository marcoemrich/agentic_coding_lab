import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Single cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation -- [(0,1),(1,1)] -> [] (each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival -- center cell with 3 neighbors survives", () => {
    // Live center (1,1) with 2 live neighbors survives (block corner).
    // Block [(0,0),(1,0),(0,1),(1,1)]: (1,1) has 3 neighbors and stays alive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation -- center cell with 4 neighbors dies", () => {
    // Center (1,1) alive with 4 orthogonal neighbors dies.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction -- dead cell with exactly 3 neighbors becomes alive", () => {
    // Dead cell (1,1) with 3 live neighbors (0,0),(1,0),(0,1) becomes alive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Blinker Gen0 -> Gen1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Blinker oscillates back -- Gen1 -> Gen2 returns to vertical", () => {
    // Gen1 horizontal [(-1,1),(0,1),(1,1)] -> Gen2 vertical [(0,0),(0,1),(0,2)]
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([0, 2]);
  });
});
