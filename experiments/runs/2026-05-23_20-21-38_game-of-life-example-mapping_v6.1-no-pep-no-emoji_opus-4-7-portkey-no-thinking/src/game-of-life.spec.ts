import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (0 neighbors) — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die (1 neighbor each) — [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: middle cell with 2 neighbors survives — [(0,0),(1,0),(2,0)] keeps (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: center cell of full 3x3 (8 neighbors) dies — (1,1) not in result", () => {
    const full3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(full3x3)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape [(0,0),(1,0),(0,1)] produces (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("Block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("Blinker oscillator rotates — vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    const toKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(result.map(toKey).sort()).toEqual(horizontal.map(toKey).sort());
  });
  it("should handle negative coordinates — blinker at (-10,-10..-8) rotates to (-11..-9, -9)", () => {
    const vertical: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
    const horizontal: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
    const toKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect(nextGeneration(vertical).map(toKey).sort()).toEqual(horizontal.map(toKey).sort());
  });
});
