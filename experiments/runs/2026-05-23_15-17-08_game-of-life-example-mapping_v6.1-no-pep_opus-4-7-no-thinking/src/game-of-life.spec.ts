import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]): [number, number][] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation, 0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two adjacent cells both die (each has 1 neighbor) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: center cell of vertical blinker with 2 neighbors survives — result contains (0,1)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("Rule 3 overpopulation: center cell with 4 neighbors dies — center (1,1) not in result", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape result contains (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block (still life): 2x2 block remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker (oscillator): vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("handles negative coordinates — blinker at negative offset oscillates correctly", () => {
    const vertical: [number, number][] = [[-10, -5], [-10, -4], [-10, -3]];
    const horizontal: [number, number][] = [[-11, -4], [-10, -4], [-9, -4]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
