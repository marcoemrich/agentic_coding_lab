import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("Rule 2 survival: middle of 3-in-a-row survives with exactly 2 live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 overpopulation: live cell with more than 3 live neighbors dies", () => {
    // Gen 0: '###' top, '.#.' mid, '###' bot — center (1,1) has 6 live neighbors
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: L-shape — dead (1,1) with 3 neighbors becomes alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.map(c => c.join(",")).sort()).toEqual(
      [[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")).sort()
    );
  });
  it("blinker oscillator vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.map(c => c.join(",")).sort()).toEqual(
      [[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")).sort()
    );
  });
  it("handles negative coordinates — blinker shifted into negative space", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result.map(c => c.join(",")).sort()).toEqual(
      [[-6, -4], [-5, -4], [-4, -4]].map(c => c.join(",")).sort()
    );
  });
});
