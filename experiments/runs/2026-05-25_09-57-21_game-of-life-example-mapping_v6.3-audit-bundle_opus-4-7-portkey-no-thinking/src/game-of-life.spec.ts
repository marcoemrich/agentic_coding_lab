import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1: two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2: live cell with 2 neighbors survives — blinker center (0,1) survives from [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("Rule 3: live cell with 4 neighbors dies from overpopulation — center (1,1) dies in 3x3 with center filled", () => {
    const grid: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(grid);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4: dead cell with exactly 3 neighbors becomes alive — (1,1) born from [(0,0),(1,0),(0,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual(block.slice().sort());
  });
  it("Blinker oscillates — vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.slice().sort());
  });
  it("handles negative coordinates — block at negative coords unchanged", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(nextGeneration(block).sort()).toEqual(block.slice().sort());
  });
});
