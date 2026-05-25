import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest case: single cell dies (rule 1, underpopulation with 0 neighbors)
  it("single live cell at (0,0) dies with 0 neighbors -- next gen is []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation - two adjacent cells each have 1 neighbor and die
  it("two adjacent live cells [(0,1),(1,1)] each have 1 neighbor and die -- next gen is []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 3: Overpopulation - live cell with > 3 neighbors dies
  it("live cell (1,1) with 4 live neighbors dies (overpopulation) -- gen0 [(0,0),(2,0),(1,1),(0,2),(2,2)] -- (1,1) not in next gen", () => {
    const result = nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4: Reproduction - dead cell with exactly 3 neighbors becomes alive
  it("dead cell (1,1) with exactly 3 live neighbors becomes alive -- gen0 [(0,0),(1,0),(0,1)] -> gen1 contains (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 2: Survival - live cell with 2 neighbors survives
  it("live cell (1,0) with 2 live neighbors survives -- gen0 [(0,0),(1,0),(2,0),(1,2)] -> gen1 contains (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });

  // Pattern: Block (still life) - 2x2 block stays the same
  it("block still life [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`)))
      .toEqual(new Set(input.map(c => `${c[0]},${c[1]}`)));
  });

  // Pattern: Single cell dies (duplicate-ish of first test, kept per spec example)
  it("single cell pattern [(0,0)] dies -- next gen is []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Pattern: Blinker (oscillator) - vertical to horizontal
  it("blinker gen0 [(0,0),(0,1),(0,2)] -> gen1 [(-1,1),(0,1),(1,1)] (vertical to horizontal)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const toKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(new Set(result.map(toKey))).toEqual(new Set([[-1, 1], [0, 1], [1, 1]].map(c => toKey(c as Cell))));
  });

  // Pattern: Blinker oscillates back
  it("blinker gen1 [(-1,1),(0,1),(1,1)] -> gen2 [(0,0),(0,1),(0,2)] (horizontal back to vertical)", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    const toKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(new Set(result.map(toKey))).toEqual(new Set([[0, 0], [0, 1], [0, 2]].map(c => toKey(c as Cell))));
  });

  // Negative coordinates work
  it("handles negative coordinates: block at [(-1,-1),(0,-1),(-1,0),(0,0)] remains unchanged", () => {
    const input: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(input);
    const toKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(new Set(result.map(toKey))).toEqual(new Set(input.map(toKey)));
  });
});
