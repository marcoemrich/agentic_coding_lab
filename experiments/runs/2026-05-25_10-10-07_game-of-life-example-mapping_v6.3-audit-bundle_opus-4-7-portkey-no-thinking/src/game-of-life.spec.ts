import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid returns empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation (1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("live cell with 4 neighbors dies from overpopulation (plus pattern center)", () => {
    const plus: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(plus);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — L-shape grows to block", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("handles negative coordinates correctly — block at negatives survives", () => {
    const result = nextGeneration([[-2, -2], [-1, -2], [-2, -1], [-1, -1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-2,-2", "-1,-2", "-2,-1", "-1,-1"]),
    );
  });
});
