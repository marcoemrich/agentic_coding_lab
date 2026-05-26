import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest cases
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation
  it("two adjacent cells both die (each has 1 neighbor) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction
  it("dead cell with exactly 3 live neighbors becomes alive -- L-shape produces block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });

  // Rule 2: Survival (with 3 neighbors, center survives)
  it("live cell with 2 live neighbors survives -- middle of 3-in-a-row stays alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,0")).toBe(true);
  });

  // Rule 3: Overpopulation
  it("center cell with 4 live neighbors dies (overpopulation) -- plus-pattern center dies", () => {
    // Plus pattern: center (0,0) + four orthogonal neighbors. Center has 4 neighbors → dies.
    const result = nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("0,0")).toBe(false);
  });

  // Pattern examples
  it("blinker oscillates vertical -> horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const expectedSet = new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(",")));
    expect(resultSet).toEqual(expectedSet);
  });
  it("block is a still life -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const expectedSet = new Set(input.map((c) => c.join(",")));
    expect(resultSet).toEqual(expectedSet);
  });

  // Negative coordinates
  it("handles negative coordinates -- blinker at negative coords", () => {
    // Vertical blinker at x=-10, y=-5..-3 oscillates to horizontal at y=-4, x=-11..-9
    const result = nextGeneration([[-10, -5], [-10, -4], [-10, -3]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const expectedSet = new Set([[-11, -4], [-10, -4], [-9, -4]].map((c) => c.join(",")));
    expect(resultSet).toEqual(expectedSet);
  });
});
