import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  // Simplest case: empty grid
  it("should return an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (underpopulation, 0 neighbors)
  it("should kill a single live cell — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation (live cell with < 2 neighbors dies)
  it("should kill two cells each with 1 neighbor — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4 – Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("should bring a dead cell with exactly 3 neighbors to life — (1,1) becomes alive", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });

  // Rule 2 – Survival (live cell with 2 or 3 neighbors lives on)
  it("should keep a live cell with 3 neighbors alive — center (1,1) survives", () => {
    // (1,1) is alive with exactly 3 live neighbors above it → survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([
      1, 1,
    ]);
  });

  // Rule 3 – Overpopulation (live cell with > 3 neighbors dies)
  it("should kill a live cell with 4 neighbors — center (1,1) dies", () => {
    // Center (1,1) is surrounded by >3 live neighbors → dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });

  // Block (still life) — unchanged
  it("should keep a block still — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  // Blinker (oscillator) — vertical to horizontal
  it("should oscillate a blinker — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sorted([[-1, 1], [0, 1], [1, 1]])
    );
  });

  // Negative coordinates
  it("should handle negative coordinates in the blinker's second generation", () => {
    // Horizontal blinker (with negative x) oscillates back to vertical
    expect(sorted(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [0, 1], [0, 2]])
    );
  });
});
