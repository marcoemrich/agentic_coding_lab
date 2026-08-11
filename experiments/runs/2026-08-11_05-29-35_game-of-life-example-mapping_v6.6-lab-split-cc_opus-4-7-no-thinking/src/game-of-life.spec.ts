import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 – Underpopulation
  it("two adjacent cells both die (each has 1 neighbor) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival (with reproduction context)
  it("horizontal row of 3 becomes vertical (blinker gen 0 → gen 1) — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });

  // Rule 3 – Overpopulation
  it("center of filled 3x3 dies from overpopulation — center cell of full 3x3 not in result", () => {
    const full3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(full3x3);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 – Reproduction
  it("dead cell with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });

  // Pattern: Block (still life)
  it("block stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });

  // Pattern: Blinker oscillation (gen 1 back to gen 2 = original)
  it("blinker oscillates back after two generations — vertical → horizontal → vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(vertical);
    const gen2 = nextGeneration(gen1);
    expect(gen2.sort()).toEqual(vertical.sort());
  });

  // Negative coordinates
  it("handles negative coordinates — block at negative coords stays unchanged", () => {
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
});
