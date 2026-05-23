import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a lone live cell", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: L-tromino produces a 2x2 block", () => {
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const expected: Cell[] = [[0, 1], [0, 2], [1, 1], [1, 2]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(expected));
  });
  it("Rule 2 Survival: live cell with 2 neighbors survives — middle of a horizontal triple", () => {
    // Horizontal row [(0,0),(1,0),(2,0)]. The middle (1,0) has 2 live neighbors and must survive.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: live cell with 4 neighbors dies — center of plus-shape", () => {
    // Center (1,1) is live with neighbors at (0,1),(2,1),(1,0),(1,2) — 4 neighbors → dies.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life: 2x2 block remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillator: vertical becomes horizontal", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });
  it("should handle negative coordinates — blinker in negative space oscillates correctly", () => {
    const gen0: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
    const gen1: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });
});
