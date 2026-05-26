import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest case
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies (underpopulation - 0 neighbors)
  it("single live cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (live cell with < 2 neighbors dies)
  it("two adjacent live cells both die (each has 1 neighbor) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("dead cell with exactly 3 live neighbors becomes alive -- Rule 4 example yields [(0,0),(1,0),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    const expected = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(expected);
    expect(result.length).toBe(4);
  });

  // Rule 2: Survival (live cell with 2 or 3 neighbors lives)
  // Spec Gen 0: ### / ... / .#. with cells [(0,0),(1,0),(2,0),(1,2)].
  // Applying the four rules to the unbounded grid:
  //  - (1,0) has 2 live neighbors → survives (Rule 2)
  //  - (0,1) and (2,1) each have 3 live neighbors → reproduce
  //  - (1,-1) (below the top row) has 3 live neighbors → reproduce
  // (Note: the prose in prompt.md for this example contains an internal
  // inconsistency vs the picture; we test the rules-correct outcome.)
  it("Rule 2 survival -- live cell with 2 or 3 neighbors lives on", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(gen0);
    const expected = new Set(["1,0", "0,1", "2,1", "1,-1"]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(expected);
    expect(result.length).toBe(4);
  });

  // Rule 3: Overpopulation (live cell with > 3 neighbors dies)
  // Gen 0: ### / .#. / ### with cells [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)].
  // Center (1,1) has 6 live neighbors → dies (overpopulation).
  // Corner+edge live cells all have 2 or 3 neighbors → survive.
  // Dead cells (1,-1) and (1,3) each gain 3 neighbors → reproduce.
  // (Spec picture for this example is also inconsistent with the rules;
  //  we test the rules-correct outcome to verify Rule 3 is applied.)
  it("Rule 3 overpopulation -- live cell with more than 3 neighbors dies", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    const resultSet = new Set(result.map((c) => c.join(",")));
    // (1,1) must be dead (overpopulation)
    expect(resultSet.has("1,1")).toBe(false);
    // Surviving live cells
    const expected = new Set([
      "0,0", "1,0", "2,0",
      "0,2", "1,2", "2,2",
      "1,-1", "1,3",
    ]);
    expect(resultSet).toEqual(expected);
  });

  // Block (still life)
  it("block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(",")))
    );
    expect(result.length).toBe(4);
  });

  // Blinker (oscillator)
  it("blinker oscillates vertical -> horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    const expected = new Set(["-1,1", "0,1", "1,1"]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(expected);
    expect(result.length).toBe(3);
  });

  // Negative coordinates
  it("handles negative coordinates -- blinker shifted into negative space oscillates correctly", () => {
    // Vertical blinker shifted to (-10, -10) region: live cells at x=-10, y in {-11,-10,-9}
    const gen0: [number, number][] = [[-10, -11], [-10, -10], [-10, -9]];
    const result = nextGeneration(gen0);
    const expected = new Set(["-11,-10", "-10,-10", "-9,-10"]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(expected);
    expect(result.length).toBe(3);
  });
});
