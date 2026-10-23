import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty generation for an empty grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell with no neighbors -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill live cells with only 1 neighbor (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should keep a live cell alive with 2 live neighbors (survival) -- block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should keep a live cell alive with 3 live neighbors (survival) -- middle cell of 3-in-a-row survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toEqual([[1, -1], [1, 0], [0, 1], [2, 1]]);
  });

  it("should kill a live cell with 4 live neighbors (overpopulation) -- center (1,1) dies", () => {
    expect(nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]).filter(([x, y]) => x === 1 && y === 1)).toEqual([]);
  });

  it("should keep a dead cell dead with 2 live neighbors (no reproduction)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("should revive a dead cell with exactly 3 live neighbors (reproduction) -- dead (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should keep a dead cell dead with 4 live neighbors (no reproduction)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [2, 1], [1, 2]]);
    expect(result.filter(([x, y]) => x === 1 && y === 1)).toEqual([]);
  });

  it("should keep a dead cell dead with fewer than 3 live neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should support negative coordinates", () => {
    expect(nextGeneration([[-1, -1]])).toEqual([]);
  });

  it("should produce Gen 1 from a blinker oscillator -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it("should leave a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("should produce Gen 2 from a blinker oscillator -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});