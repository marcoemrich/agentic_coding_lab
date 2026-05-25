import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty array — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(input).map(c => c.join(",")))).toEqual(
      new Set(input.map(c => c.join(","))),
    );
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("live cell with 2 neighbors survives (rule 2) — (1,0) in '###/.../.#.' has 2 neighbors and survives", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => c.join(",")))).toContain("1,0");
  });
  it("live cell with more than 3 neighbors dies from overpopulation (rule 3) — center of '###/.#./###' dies", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => c.join(",")))).not.toContain("1,1");
  });
  it("dead cell with exactly 3 live neighbors becomes alive (rule 4) — '(1,1)' in '##./#../...' is born", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => c.join(",")))).toContain("1,1");
  });
  it("handles negative coordinates — blinker at negative offset oscillates correctly", () => {
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"]),
    );
  });
});
