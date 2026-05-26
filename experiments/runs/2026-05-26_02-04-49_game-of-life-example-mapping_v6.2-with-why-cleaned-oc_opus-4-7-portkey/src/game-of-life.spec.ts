import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest case
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1: Underpopulation
  it("single live cell dies (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells die (1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction
  it("dead cell with exactly 3 neighbors becomes alive -- L-shape produces block-like result", () => {
    // Gen 0: cells at (0,0), (1,0), (0,1) form an L
    // (1,1) is dead but has exactly 3 live neighbors -> becomes alive
    // All 3 live cells have 2 neighbors -> survive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });

  // Rule 2: Survival
  it("live cell with 2 or 3 neighbors survives -- Rule 2 example: center (1,1) survives", () => {
    // Gen 0: top row ### at y=0, plus (1,2)
    // Live: (0,0), (1,0), (2,0), (1,2)
    // (1,1) is dead, has 4 neighbors -> stays dead
    // (1,0) center top has 2 neighbors -> survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    // Verify (1,0) survives (live cell with 2 neighbors stays alive)
    expect(result).toContainEqual([1, 0]);
  });

  // Rule 3: Overpopulation
  it("live cell with more than 3 neighbors dies -- Rule 3 example", () => {
    // Gen 0: full top and bottom rows, center alive, sides dead
    // Center (1,1) has 6 live neighbors -> overpopulation -> dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center (1,1) should die from overpopulation
    expect(result).not.toContainEqual([1, 1]);
    // The 4 corners survive (each has 3 neighbors)
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([2, 0]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toContainEqual([2, 2]);
  });

  // Pattern examples
  it("blinker oscillates -- vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("block is a still life -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });

  // Negative coordinates
  it("handles negative coordinates -- blinker at negative coords oscillates correctly", () => {
    // Vertical blinker centered at (-5, -5)
    const result = nextGeneration([[-5, -6], [-5, -5], [-5, -4]]);
    // Should become horizontal: (-6,-5), (-5,-5), (-4,-5)
    expect(result.sort()).toEqual([[-6, -5], [-5, -5], [-4, -5]].sort());
  });
});
