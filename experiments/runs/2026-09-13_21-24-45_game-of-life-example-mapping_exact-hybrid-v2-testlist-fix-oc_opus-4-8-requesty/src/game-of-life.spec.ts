import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 — Underpopulation (live cell with < 2 neighbors dies)
  it("two adjacent cells both die (each has 1 neighbor) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4 — Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("dead cell with exactly 3 neighbors becomes alive — L-tromino [(0,1),(1,1),(0,0)] gains (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  // Rule 2 — Survival (live cell with 2 or 3 neighbors lives on)
  it("live cell with 2 neighbors survives — center of a 3-in-a-row stays alive", () => {
    // Vertical triple: (0,0),(0,1),(0,2). The live center (0,1) has 2 live
    // neighbors → survives (Rule 2).
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const hasCenter = result.some(([x, y]) => x === 0 && y === 1);
    expect(hasCenter).toBe(true);
  });

  // Rule 3 — Overpopulation (live cell with > 3 neighbors dies)
  it("live cell with 4 neighbors dies — center (1,1) of plus-in-square dies", () => {
    // Gen 0: ### / .#. / ### → live center (1,1) has more than 3 live
    // neighbors → dies (Rule 3, overpopulation).
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    const hasCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenter).toBe(false);
  });

  // Pattern examples
  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
}
);
