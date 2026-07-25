import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// NOTE on the spec's "Examples per Rule":
// The Rule 1, Rule 4, blinker, block and single-cell examples are all consistent
// with the canonical Conway rules (Moore neighbourhood). The Rule 2 (survival) and
// Rule 3 (overpopulation) *ASCII diagrams* are not -- their stated "Gen 1" grids
// contradict the rules themselves and the other consistent examples (verified by
// computing the true next generation). The RULES (1-4) are the source of truth, so
// those two rules are covered below with small, self-consistent inputs whose
// expected outputs are the true Game-of-Life results. Every rule and every
// consistent example from the spec has a test.

describe("Game of Life - Next Generation", () => {
  it("empty input returns empty array -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell with no neighbors dies (Rule 1 underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells each with 1 neighbor die (Rule 1 underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("live cell with more than 3 neighbors dies (Rule 3 overpopulation) -- [(0,0),(0,1),(1,1),(2,1),(2,2)] -> [(0,0),(0,1),(2,1),(2,2)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]])).toEqual([[0, 0], [0, 1], [2, 1], [2, 2]]);
  });

  it("dead cell with exactly 3 neighbors becomes alive (Rule 4 reproduction) -- [(0,1),(0,2),(1,2)] -> [(0,1),(0,2),(1,1),(1,2)]", () => {
    expect(nextGeneration([[0, 1], [0, 2], [1, 2]])).toEqual([[0, 1], [0, 2], [1, 1], [1, 2]]);
  });

  it("block still life is unchanged (Rule 2 survival, 3 neighbors each) -- [(0,0),(0,1),(1,0),(1,1)] -> [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("blinker oscillator Gen 0 -> Gen 1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it("blinker returns to Gen 0 after two generations (period 2) -- nextGeneration(nextGeneration([(0,0),(0,1),(0,2)])) -> [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  it("handles negative coordinates on the infinite grid -- [(-5,-1),(-4,-1),(-3,-1)] -> [(-4,-2),(-4,-1),(-4,0)]", () => {
    expect(nextGeneration([[-5, -1], [-4, -1], [-3, -1]])).toEqual([[-4, -2], [-4, -1], [-4, 0]]);
  });

  it("deduplicates duplicate input cells -- [(0,0),(0,0),(0,1),(1,0)] -> [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 0], [0, 1], [1, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
