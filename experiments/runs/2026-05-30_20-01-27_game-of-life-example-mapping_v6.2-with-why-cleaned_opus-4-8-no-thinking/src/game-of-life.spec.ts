import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("an empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation (live cell with < 2 neighbors dies)
  it("two adjacent cells both die (each has 1 neighbor) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival (live cell with 2 or 3 neighbors lives on)
  it("a live cell with 2 live neighbors survives — center (1,0) of '###' survives", () => {
    // Row of three: (0,0),(1,0),(2,0). The center (1,0) has 2 live neighbors → survives.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });

  // Rule 4 - Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("dead cell (1,1) with exactly 3 neighbors becomes alive — '##./#../...' → includes (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 3 - Overpopulation (live cell with > 3 neighbors dies)
  it("center cell (1,1) with 4 neighbors dies — '###/.#./###' drops (1,1)", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Pattern: Block (still life)
  it("block is stable — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });

  // Pattern: Blinker (oscillator) - negative coordinates
  it("blinker oscillates vertical→horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([[-1, 1], [0, 1], [1, 1]] as [number, number][]),
    );
  });
});
