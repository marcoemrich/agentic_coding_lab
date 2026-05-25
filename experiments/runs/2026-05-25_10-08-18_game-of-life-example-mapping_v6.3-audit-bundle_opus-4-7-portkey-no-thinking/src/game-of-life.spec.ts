import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive — L-shape [(0,2),(1,2),(0,1)] produces (1,1)", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 1], [1, 1], [0, 2], [1, 2]].map((c) => c.join(","))),
    );
  });
  it("Rule 2 Survival: cell with 2 or 3 neighbors lives on — block [(0,0),(1,0),(0,1),(1,1)] is a still life", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Rule 3 Overpopulation: cell with more than 3 neighbors dies — center of plus dies (4 neighbors)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Blinker oscillates: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("handles negative coordinates — blinker at x=-5 rotates correctly", () => {
    const result = nextGeneration([[-5, 0], [-5, 1], [-5, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-6, 1], [-5, 1], [-4, 1]].map((c) => c.join(","))),
    );
  });
});
