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
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — L-shape [(0,0),(1,0),(0,1)] → block [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("live cell with more than 3 neighbors dies from overpopulation — filled 3x3 center dies", () => {
    const filled: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(filled);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("vertical blinker rotates to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("horizontal blinker rotates back to vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "0,1", "0,2"]),
    );
  });
  it("handles negative coordinates correctly — block at [(-10,-10),(-9,-10),(-10,-9),(-9,-9)] stable", () => {
    const block: [number, number][] = [[-10, -10], [-9, -10], [-10, -9], [-9, -9]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
});
