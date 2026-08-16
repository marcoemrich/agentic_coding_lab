import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("single cell at (0,0) dies -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells each have one neighbor and die -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with exactly two neighbors survives", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("live cell with exactly three neighbors survives", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("live cell with more than three neighbors dies", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("dead cell with exactly three neighbors becomes alive", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("four-cell block remains unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("blinker rotates to [(-1,1),(0,1),(1,1)] and returns after two generations", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    const horizontal = nextGeneration(vertical);
    expect(new Set(horizontal.map(String))).toEqual(new Set(["-1,1", "0,1", "1,1"]));
    expect(new Set(nextGeneration(horizontal).map(String))).toEqual(new Set(vertical.map(String)));
  });
});
