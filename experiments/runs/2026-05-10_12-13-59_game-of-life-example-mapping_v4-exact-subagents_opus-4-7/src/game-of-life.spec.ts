// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should preserve a 2x2 block (still life - each cell has 3 neighbors)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => (c as number[]).join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("should rotate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => (c as number[]).join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("should bring a dead cell with exactly 3 live neighbors to life", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => (c as number[]).join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // 2x3 block: cells (0,1) and (1,1) each have 5 live neighbors → die
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]);
    expect(new Set(result.map((c) => (c as number[]).join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,2", "1,2", "-1,1", "2,1"]),
    );
  });
  it("should support negative coordinates", () => {
    const result = nextGeneration([[-5, -5], [-4, -5], [-5, -4], [-4, -4]]);
    expect(new Set(result.map((c) => (c as number[]).join(",")))).toEqual(
      new Set(["-5,-5", "-4,-5", "-5,-4", "-4,-4"]),
    );
  });
});
