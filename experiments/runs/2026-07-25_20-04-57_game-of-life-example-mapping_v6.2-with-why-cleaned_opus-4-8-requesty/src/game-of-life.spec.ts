import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest case: empty grid
  it("returns an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (pattern example)
  it("a single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("two adjacent live cells both die (each has 1 neighbor) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival
  it("center cell with 3 neighbors survives — center (1,1) lives on", () => {
    // (1,1) is alive and has 3 live neighbors: (0,2),(1,2),(2,2)
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });

  // Rule 3 - Overpopulation
  it("center cell with 4 neighbors dies — center (1,1) dies", () => {
    // (1,1) is alive with 4 live neighbors: the four corners
    const next = nextGeneration([[0, 0], [2, 0], [0, 2], [2, 2], [1, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction
  it("dead cell with exactly 3 neighbors becomes alive — (1,1) born", () => {
    // dead cell (1,1) has 3 live neighbors: (0,2),(1,2),(0,1)
    const next = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });

  // Pattern: Block (still life)
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });

  // Pattern: Blinker (oscillator)
  it("blinker rotates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(
      expect.arrayContaining([[-1, 1], [0, 1], [1, 1]])
    );
  });

  // Negative coordinates
  it("handles negative coordinates correctly", () => {
    // vertical blinker in negative space rotates to horizontal
    const next = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(
      expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]])
    );
  });
});
