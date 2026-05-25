import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die (each has 1 neighbor) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell with 2 neighbors survives — middle cell of horizontal blinker [(0,0),(1,0),(2,0)] keeps (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["1,-1", "1,0", "1,1"])
    );
  });
  it("Rule 3 Overpopulation: live cell with >3 neighbors dies — center (1,1) of 3x3-minus-edges has 6 neighbors and dies", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    const set = new Set(result.map((c) => c.join(",")));
    expect(set.has("1,1")).toBe(false);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — [(0,0),(1,0),(0,1)] result includes (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const set = new Set(result.map((c) => c.join(",")));
    expect(set.has("1,1")).toBe(true);
  });
  it("Block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same set", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("Blinker oscillator vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
  it("Handles negative coordinates — vertical blinker at (-5,-6..-4) → horizontal at (-6..-4,-5)", () => {
    const result = nextGeneration([[-5, -6], [-5, -5], [-5, -4]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-6,-5", "-5,-5", "-4,-5"])
    );
  });
});
