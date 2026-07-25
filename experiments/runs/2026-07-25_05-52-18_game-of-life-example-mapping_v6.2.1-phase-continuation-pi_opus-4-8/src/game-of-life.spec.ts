import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("returns an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("Rule 1: two adjacent live cells both die (1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival
  it("Rule 2: a live cell with 2 or 3 neighbors survives (blinker center (1,1) survives)", () => {
    const result = nextGeneration([
      [0, 2], [1, 2], [2, 2],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 3 - Overpopulation
  it("Rule 3: a live cell with more than 3 neighbors dies (center (1,1) of full 3x3 dies)", () => {
    const result = nextGeneration([
      [0, 2], [1, 2], [2, 2],
      [0, 1], [1, 1], [2, 1],
      [0, 0], [1, 0], [2, 0],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction
  it("Rule 4: a dead cell with exactly 3 neighbors becomes alive -- (1,1) born", () => {
    const result = nextGeneration([[0, 1], [0, 0], [1, 0]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Pattern examples
  it("Blinker oscillates: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life is unchanged: [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
