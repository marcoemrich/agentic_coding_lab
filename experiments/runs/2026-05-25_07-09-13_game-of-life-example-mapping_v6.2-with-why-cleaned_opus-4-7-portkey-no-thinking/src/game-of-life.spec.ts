import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die (1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: cell with 2 neighbors survives (block still life) — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("Rule 2 Survival: center cell with 3 neighbors survives — top row + bottom-mid keeps (1,0) alive", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: center cell with 4+ neighbors dies — full 3x3 → center (1,1) dies", () => {
    const fullGrid: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullGrid);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape births (1,1)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toContainEqual([1, 1]);
  });
  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("handles negative coordinates — blinker at negative origin oscillates correctly", () => {
    const verticalAtNeg: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontalAtNeg: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(verticalAtNeg);
    expect(result.sort()).toEqual(horizontalAtNeg.sort());
  });
});
