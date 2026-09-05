import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("empty grid remains []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell [(0,0)] dies to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("adjacent pair [(0,1),(1,1)] dies to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with two neighbors survives", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  it("live center (1,1) with three neighbors survives", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("dense illustrated pattern kills center with six neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it("three-cell corner births (1,1), yielding a block", () => {
    expect(new Set(nextGeneration([[0, 0], [1, 0], [0, 1]]).map(String)))
      .toEqual(new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(String)));
  });
  it("dead cell with two neighbors stays dead", () => {
    expect(nextGeneration([[0, 0], [2, 0]])).not.toContainEqual([1, 1]);
  });
  it("dead cell with four neighbors stays dead", () => {
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual([...block].sort());
  });
  it("vertical blinker becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).sort())
      .toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("blinker returns to initial state after two generations", () => {
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(blinker)).sort()).toEqual([...blinker].sort());
  });
  it("patterns evolve at large positive and negative coordinates without boundaries", () => {
    const cells: [number, number][] = [];
    const expected: [number, number][] = [];
    for (const [x, y] of [[-1000000, -1000000], [1000000, 1000000], [-1000000, 1000000], [1000000, -1000000]]) {
      cells.push([x, y - 1], [x, y], [x, y + 1]);
      expected.push([x - 1, y], [x, y], [x + 1, y]);
    }
    expect(nextGeneration(cells).sort()).toEqual(expected.sort());
  });
});
