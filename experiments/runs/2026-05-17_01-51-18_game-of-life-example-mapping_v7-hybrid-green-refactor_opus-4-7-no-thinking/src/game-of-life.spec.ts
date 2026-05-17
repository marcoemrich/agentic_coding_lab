import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a block (2x2) alive unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("transforms a vertical blinker into a horizontal blinker (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("kills the center of a filled 3x3 due to overpopulation (>3 neighbors)", () => {
    // Pattern (# = alive):
    // ###
    // .#.
    // ###
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    // Center cell (1,1) has 4 live neighbors → dies
    expect(result).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // Pattern:
    // ##.
    // #..
    // ...
    // Dead cell (1,1) has exactly 3 live neighbors → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    // Blinker centered at negative coordinates
    // Vertical blinker at x=-5: (-5,-1), (-5,0), (-5,1)
    // Should become horizontal: (-6,0), (-5,0), (-4,0)
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const expected: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
