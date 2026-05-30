import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(",")))
    );
    expect(result.length).toBe(4);
  });
  it("live cell with 2 neighbors survives (survival rule)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("live cell with 3 neighbors survives — center of [###/.#.] at (1,0) survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("live cell with 4 neighbors dies from overpopulation", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(false);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — (1,1) in [##./#../...]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(true);
  });
  it("blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("handles negative coordinates correctly", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(["-6,-4", "-5,-4", "-4,-4"]));
  });
});
