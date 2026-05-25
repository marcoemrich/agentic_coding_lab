import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const normalize = (cells: Cell[]): string[] =>
  cells.map(([x, y]) => `${x},${y}`).sort();

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Block still life: 2x2 block stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — [(0,2),(1,2),(0,1)] produces (1,1)", () => {
    const input: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(normalize(nextGeneration(input))).toEqual(normalize(expected));
  });
  it("Blinker oscillator: vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(normalize(nextGeneration(input))).toEqual(normalize(expected));
  });
  it("Rule 3 Overpopulation: live cell with more than 3 neighbors dies — center (1,1) of full 3x3 has 8 neighbors and dies", () => {
    const fullGrid: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(fullGrid);
    expect(normalize(next)).not.toContain("1,1");
  });
  it("should handle negative coordinates correctly — blinker at (-5,-5) rotates", () => {
    const input: Cell[] = [[-5, -6], [-5, -5], [-5, -4]];
    const expected: Cell[] = [[-6, -5], [-5, -5], [-4, -5]];
    expect(normalize(nextGeneration(input))).toEqual(normalize(expected));
  });
});
