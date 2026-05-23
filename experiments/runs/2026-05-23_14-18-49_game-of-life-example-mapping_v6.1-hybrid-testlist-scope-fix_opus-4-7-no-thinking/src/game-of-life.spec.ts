import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives (survival) — center of row [(0,0),(1,0),(2,0)] keeps (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(["1,-1", "1,0", "1,1"])
    );
  });
  it("live cell with 3 neighbors survives (survival) — '##/##' block: each cell has 3 neighbors, all survive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("0,0")).toBe(true);
    expect(resultSet.has("1,0")).toBe(true);
    expect(resultSet.has("0,1")).toBe(true);
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("live cell with >3 neighbors dies (overpopulation) — center (1,1) of '###/.#./###' dies", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — '##./#../...' produces (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("handles negative coordinates — blinker at (-10,*) oscillates correctly", () => {
    const result = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet).toEqual(new Set(["-11,-9", "-10,-9", "-9,-9"]));
  });
});
