import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (Underpopulation): two adjacent cells die — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 (Reproduction): dead cell with exactly 3 neighbors becomes alive — L-shape [(0,2),(1,2),(0,1)] → [(0,1),(1,1),(0,2),(1,2)]", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 1], [1, 1], [0, 2], [1, 2]].map((c) => c.join(","))),
    );
  });
  it("Rule 2 (Survival): live cell with 3 neighbors survives — diagonal cluster around (1,1)", () => {
    // (1,1) has 3 live neighbors: (0,0), (2,0), (0,2) → survives
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("Rule 3 (Overpopulation): live cell with more than 3 neighbors dies — center of ###/.#./### dies", () => {
    // Center (1,1) has 6 live neighbors → dies
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("Block still life stays the same — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("Blinker oscillates — vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Handles negative coordinates — blinker at negative coords oscillates correctly", () => {
    // Vertical blinker at (-5,-5),(-5,-4),(-5,-3) → horizontal (-6,-4),(-5,-4),(-4,-4)
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-6, -4], [-5, -4], [-4, -4]].map((c) => c.join(","))),
    );
  });
});
