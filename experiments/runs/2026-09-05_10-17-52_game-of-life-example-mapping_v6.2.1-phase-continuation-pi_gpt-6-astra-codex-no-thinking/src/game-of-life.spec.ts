import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell at (0,0) dies to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("adjacent cells (0,1) and (1,1) die to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with two neighbors survives", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("live center (1,1) with three neighbors survives", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]])).toContainEqual([1, 1]);
  });
  it("live center with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("dense example center with six neighbors dies", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it("three-cell corner reproduces (1,1) to form a block", () => {
    expect(new Set(nextGeneration([[0, 0], [1, 0], [0, 1]]).map(String)))
      .toEqual(new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(String)));
  });
  it("dead cells without exactly three neighbors stay dead", () => {
    const neighbors: [number, number][] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    for (const count of [0, 1, 2, 4, 5, 6, 7, 8]) {
      expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([0, 0]);
    }
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map(String))).toEqual(new Set(block.map(String)));
  });
  it("blinker becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(new Set(nextGeneration([[0, 0], [0, 1], [0, 2]]).map(String)))
      .toEqual(new Set([[-1, 1], [0, 1], [1, 1]].map(String)));
  });
  it("blinker returns to initial state after two generations", () => {
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(new Set(nextGeneration(nextGeneration(blinker)).map(String)))
      .toEqual(new Set(blinker.map(String)));
  });
  it("patterns evolve at large positive and negative coordinates without grid boundaries", () => {
    const cells: [number, number][] = [];
    const expected: [number, number][] = [];
    for (const offset of [-1_000_000, 1_000_000]) {
      cells.push([offset, offset], [offset, offset + 1], [offset, offset + 2]);
      expected.push([offset - 1, offset + 1], [offset, offset + 1], [offset + 1, offset + 1]);
    }
    expect(new Set(nextGeneration(cells).map(String))).toEqual(new Set(expected.map(String)));
  });
});
