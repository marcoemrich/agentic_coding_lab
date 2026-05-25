import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives (survival) — middle of horizontal blinker [(0,1),(1,1),(2,1)] keeps (1,1) alive", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1]]);
    expect(new Set(result.map(c => c.join(",")))).toContain("1,1");
  });
  it("live cell with 4 neighbors dies (overpopulation) — center (1,1) surrounded by (0,0),(2,0),(0,2),(2,2),(1,1) does not survive", () => {
    const result = nextGeneration([[0, 0], [2, 0], [0, 2], [2, 2], [1, 1]]);
    const keys = new Set(result.map(c => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it.todo("dead cell with exactly 3 neighbors becomes alive (reproduction) — L-shape [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]");
  it.todo("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same set");
  it.todo("vertical blinker becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]");
  it.todo("handles negative coordinates — block at negative coords is unchanged");
});
