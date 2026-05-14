import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) stable as a still life", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // From spec Rule 4: Gen 0 [(0,0),(1,0),(0,1)] → Gen 1 includes (1,1) (newly born)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Spec Rule 3: center cell (1,1) of a 3x3 filled grid has 4 neighbors → dies
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    const keys = new Set(result.map((c) => `${c[0]},${c[1]}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("should handle negative coordinates", () => {
    // Block at negative coordinates should remain stable
    const result = nextGeneration([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["-1,-1", "0,-1", "-1,0", "0,0"])
    );
  });
});
