import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given an empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell alive when it has 2 live neighbors (survival)", () => {
    // Three in a row: center (0,0) has 2 neighbors (-1,0) and (1,0) and survives
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("0,0")).toBe(true);
  });
  it("keeps a live cell alive when it has 3 live neighbors (survival)", () => {
    // (0,0) has 3 neighbors: (1,0), (0,1), (1,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("0,0")).toBe(true);
  });
  it("kills a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors: (0,0),(1,0),(2,0),(0,2)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("brings a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) → dead cell (1,1) has 3 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(true);
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(["-1,1", "0,1", "1,1"]));
    expect(result.length).toBe(3);
  });
  it("keeps a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(",")))
    );
    expect(result.length).toBe(4);
  });
  it("handles negative coordinates correctly", () => {
    // Block at negative coordinates - should be unchanged (still life)
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(block.map((c) => c.join(","))));
    expect(result.length).toBe(4);
  });
});
