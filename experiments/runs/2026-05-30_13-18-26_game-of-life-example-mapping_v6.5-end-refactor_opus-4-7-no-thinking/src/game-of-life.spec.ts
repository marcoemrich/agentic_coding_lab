import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
    expect(result).toHaveLength(4);
  });
  it("blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
    expect(result).toHaveLength(3);
  });
  it("live cell with 2 neighbors survives (rule 2) — middle of horizontal row of 3", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,0")).toBe(true);
  });
  it("live cell with more than 3 neighbors dies from overpopulation — center of filled 3x3", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — L-shape grows", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(true);
  });
  it("handles negative coordinates — blinker at negative origin", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"])
    );
    expect(result).toHaveLength(3);
  });
});
