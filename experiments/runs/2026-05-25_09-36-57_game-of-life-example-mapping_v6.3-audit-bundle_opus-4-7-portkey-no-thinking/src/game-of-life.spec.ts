import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid produces empty next generation — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("live cell with 4+ neighbors dies from overpopulation — center of filled 3x3 dies", () => {
    const filled3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = new Set(nextGeneration(filled3x3).map((c) => c.join(",")));
    expect(result.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — L-shape produces a block", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected = new Set(["0,0", "1,0", "0,1", "1,1"]);
    const actual = new Set(nextGeneration(lShape).map((c) => c.join(",")));
    expect(actual).toEqual(expected);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected = new Set(["-1,1", "0,1", "1,1"]);
    const actual = new Set(nextGeneration(vertical).map((c) => c.join(",")));
    expect(actual).toEqual(expected);
  });
  it("handles negative coordinates correctly — blinker at x=-1 oscillates correctly", () => {
    const vertical: [number, number][] = [[-1, -1], [-1, 0], [-1, 1]];
    const expected = new Set(["-2,0", "-1,0", "0,0"]);
    const actual = new Set(nextGeneration(vertical).map((c) => c.join(",")));
    expect(actual).toEqual(expected);
  });
});
