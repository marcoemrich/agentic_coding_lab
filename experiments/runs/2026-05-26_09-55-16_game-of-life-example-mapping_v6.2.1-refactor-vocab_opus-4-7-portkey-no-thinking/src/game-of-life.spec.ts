import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("live cell with 4 neighbors dies (overpopulation) — center of full 3x3 dies", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const keys = new Set(nextGeneration(input).map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — L-shape produces block", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected = new Set(["0,0", "1,0", "0,1", "1,1"]);
    const actual = new Set(nextGeneration(input).map((c) => c.join(",")));
    expect(actual).toEqual(expected);
  });
  it("blinker oscillates vertical→horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected = new Set(["-1,1", "0,1", "1,1"]);
    const actual = new Set(nextGeneration(input).map((c) => c.join(",")));
    expect(actual).toEqual(expected);
  });
  it("handles negative coordinates correctly — blinker at negative offset oscillates", () => {
    const input: [number, number][] = [[-10, -10], [-10, -9], [-10, -8]];
    const expected = new Set(["-11,-9", "-10,-9", "-9,-9"]);
    const actual = new Set(nextGeneration(input).map((c) => c.join(",")));
    expect(actual).toEqual(expected);
  });
});
