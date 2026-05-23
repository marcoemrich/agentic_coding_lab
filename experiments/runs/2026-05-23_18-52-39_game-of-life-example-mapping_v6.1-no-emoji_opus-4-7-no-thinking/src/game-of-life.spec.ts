import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die — [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell with 2 live neighbors survives — middle of 3-in-a-row survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: live cell with 4 live neighbors dies — plus-sign center (1,1) dies", () => {
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — L-corner [(0,0),(1,0),(0,1)] yields (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("Blinker oscillator vertical to horizontal: [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("Handles negative coordinates: blinker shifted to (-5,-5) oscillates correctly", () => {
    const result = nextGeneration([[-5, -6], [-5, -5], [-5, -4]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-6,-5", "-5,-5", "-4,-5"]),
    );
  });
});
