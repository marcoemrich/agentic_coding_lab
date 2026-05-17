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
    // L-shape: each live cell has exactly 2 live neighbors → all survive.
    // Dead (1,1) has 3 live neighbors → born. Result: 2x2 block.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("keeps a live cell alive when it has 3 live neighbors (survival)", () => {
    // T-shape: live cell (1,0) has 3 live neighbors: (0,0), (2,0), (1,1) → survives.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("kills a live cell with more than 3 neighbors (overpopulation)", () => {
    // Plus-shape: center (1,1) has 4 live neighbors → dies.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("brings a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Dead cell (1,0) has 3 live neighbors: (0,0), (0,1), (1,1) → born.
    const result = nextGeneration([[0, 0], [0, 1], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("keeps a 2x2 block unchanged (still life)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker in negative-coordinate region.
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-6, -4], [-5, -4], [-4, -4]].map((c) => c.join(","))),
    );
  });
});
