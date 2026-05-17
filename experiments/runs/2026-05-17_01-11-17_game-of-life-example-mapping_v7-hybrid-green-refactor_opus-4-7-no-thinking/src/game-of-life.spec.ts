import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block pattern (2x2) remains stable (survival)", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(cells.map((c) => c.join(",")))
    );
    expect(result).toHaveLength(4);
  });
  it("live cell with 4 neighbors dies (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors: (0,1),(2,1),(1,0),(1,2)
    const cells: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1). Dead cell (1,1) has 3 live neighbors -> alive.
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("blinker oscillates from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const expected = new Set(["-1,1", "0,1", "1,1"]);
    const got = new Set(result.map((c) => c.join(",")));
    expect(got).toEqual(expected);
  });
  it("handles negative coordinates correctly", () => {
    // Block in negative quadrant - should remain stable
    const cells: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(cells);
    const got = new Set(result.map((c) => c.join(",")));
    const expected = new Set(cells.map((c) => c.join(",")));
    expect(got).toEqual(expected);
  });
});
