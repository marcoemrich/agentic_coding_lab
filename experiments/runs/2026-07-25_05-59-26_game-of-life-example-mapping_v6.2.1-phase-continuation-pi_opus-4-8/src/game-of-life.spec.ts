import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("empty input produces empty output -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("Rule 1: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival
  it("Rule 2: live cell with 2 neighbors survives -- center of [(0,0),(1,0),(2,0)] contains (1,0)", () => {
    // horizontal blinker: middle cell (1,0) has 2 live neighbors -> survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });

  // Rule 3 - Overpopulation
  it("Rule 3: live cell with 4 neighbors dies -- center (1,1) removed", () => {
    // plus shape: center (1,1) has 4 live neighbors -> dies
    const gen0: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction
  it("Rule 4: dead cell with exactly 3 neighbors becomes alive -- (1,1) born", () => {
    // three cells around dead (1,1): (0,0),(1,0),(0,1) -> (1,1) has 3 neighbors -> born
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    expect(nextGeneration(gen0)).toContainEqual([1, 1]);
  });

  // Patterns
  it("Block (still life) stays unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillates gen0 -> gen1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(gen0);
    expect(result).toHaveLength(3);
    for (const cell of gen1) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillates gen1 -> gen2 -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const gen2: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen1);
    expect(result).toHaveLength(3);
    for (const cell of gen2) {
      expect(result).toContainEqual(cell);
    }
  });
});
