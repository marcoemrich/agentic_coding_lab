import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives (Rule 2) — cell with exactly 2 live neighbors stays alive", () => {
    // L-shape: (0,0), (1,0), (0,1). Cell (0,0) has 2 neighbors: (1,0) and (0,1). It should survive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("live cell with 4 neighbors dies from overpopulation (Rule 3) — center cell dies", () => {
    // Cell (1,1) with 4 neighbors at (0,1), (2,1), (1,0), (1,2). Center should die.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (Rule 4)", () => {
    // L-shape: live cells at (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors → becomes alive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("vertical blinker becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-1, 1], [0, 1], [1, 1]]));
  });
  it("handles negative coordinates correctly — blinker at negative origin", () => {
    // Vertical blinker at x=-5: (-5,-5), (-5,-4), (-5,-3) → horizontal at y=-4
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
