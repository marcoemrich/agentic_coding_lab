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

  // Rule 1 – Underpopulation (live cell with < 2 neighbors dies)
  it("two adjacent cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival (live cell with 2 or 3 neighbors lives on)
  it("live cell with 2 neighbors survives — (1,0) stays alive", () => {
    // Gen0: ### / ... / .#.  → live cell (1,0) has 2 live neighbors: (0,0) and (2,0)
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(next).toContainEqual([1, 0]);
  });

  // Rule 4 – Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("dead cell with exactly 3 neighbors becomes alive — (1,1) born", () => {
    // Gen0: ##. / #.. / ...  → dead cell (1,1) has 3 live neighbors: (0,0),(1,0),(0,1)
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });

  // Rule 3 – Overpopulation (live cell with > 3 neighbors dies)
  it("center cell with 4 neighbors dies — (1,1) removed in next gen", () => {
    // Gen0: ### / .#. / ###  → center (1,1) has 4 live neighbors
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });

  // Pattern examples
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(next).toHaveLength(4);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([1, 1]);
  });
  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toContainEqual([-1, 1]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([1, 1]);
    expect(next).not.toContainEqual([0, 0]);
    expect(next).not.toContainEqual([0, 2]);
  });

  // Negative coordinates
  it("handles negative coordinates — blinker gen1 back to gen0 orientation", () => {
    // Horizontal blinker with negative x → vertical orientation
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(next).toHaveLength(3);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([0, 2]);
  });
});
