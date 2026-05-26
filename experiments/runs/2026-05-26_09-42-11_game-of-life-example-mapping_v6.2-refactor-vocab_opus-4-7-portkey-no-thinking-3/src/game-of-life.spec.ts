import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation, each has 1 neighbor) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 4 neighbors dies (overpopulation) — center (1,1) excluded next gen", () => {
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2],         [2, 2],
    ];
    const result = nextGeneration(input);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — L-shape [(0,2),(1,2),(0,1)] produces (1,1) alive", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("live cell with 2 neighbors survives — center of horizontal triple stays alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,0")).toBe(true);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same set", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("handles negative coordinates — vertical blinker at (-5,-5..-3) → horizontal at (-6..-4,-4)", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"]),
    );
  });
});
