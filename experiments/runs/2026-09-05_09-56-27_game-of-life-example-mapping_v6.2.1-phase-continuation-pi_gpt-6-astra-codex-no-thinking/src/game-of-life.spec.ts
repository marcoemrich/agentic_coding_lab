import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("survival diagram input evolves according to the formal eight-neighbor rules", () => {
    // The printed diagram's output conflicts with the formal rules.
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]).sort()).toEqual([[1, -1], [1, 0], [0, 1], [2, 1]].sort());
  });
  it("empty grid stays []", () => {
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
  it("dense overpopulation input loses its center and births at (1,-1) and (1,3)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]].sort());
  });
  it("three-cell corner reproduces at (1,1) to form a block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]]).sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });
  it("dead cell with two neighbors stays dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it("dead cell with four neighbors stays dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual([...block].sort());
  });
  it("blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("blinker returns to its initial state after two generations", () => {
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(blinker)).sort()).toEqual([...blinker].sort());
  });
  it("patterns evolve at large positive and negative coordinates without boundaries", () => {
    const distance = 1_000_000_000;
    const cells: [number, number][] = [];
    const expected: [number, number][] = [];
    for (const origin of [-distance, distance]) {
      cells.push([origin, origin - 1], [origin, origin], [origin, origin + 1]);
      expected.push([origin - 1, origin], [origin, origin], [origin + 1, origin]);
    }
    expect(nextGeneration(cells).sort()).toEqual(expected.sort());
  });
});
