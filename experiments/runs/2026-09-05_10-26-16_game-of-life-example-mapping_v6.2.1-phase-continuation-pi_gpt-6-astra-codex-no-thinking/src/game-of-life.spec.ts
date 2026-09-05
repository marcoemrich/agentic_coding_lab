import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("empty grid stays []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell [(0,0)] dies to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("one-neighbor pair [(0,1),(1,1)] dies to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with two neighbors survives at (0,1)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  it("live center (1,1) with three neighbors survives", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("overpopulation diagram evolves by the rules, killing its six-neighbor center", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]].sort());
  });
  it("dead (1,1) with exactly three neighbors is born, completing a block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]]).sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });
  it("dead cells with other neighbor counts stay dead", () => {
    const neighbors: [number, number][] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    for (const count of [0, 1, 2, 4, 5, 6, 7, 8]) {
      expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([0, 0]);
    }
  });
  it("survival diagram ### / ... / .#. evolves by the stated rules", () => {
    // The prompt's pictured output conflicts with its rules: (1,1) has four neighbors.
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]).sort()).toEqual([[1, -1], [1, 0], [0, 1], [2, 1]].sort());
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]).sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });
  it("blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("blinker returns to its original cells after two generations", () => {
    expect(nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]])).sort()).toEqual([[0, 0], [0, 1], [0, 2]].sort());
  });
  it("sparse distant patterns evolve at positive and negative x/y coordinates", () => {
    const centers: [number, number][] = [[-1000000, -1000000], [1000000, 1000000], [-1000000, 1000000], [1000000, -1000000]];
    const input = centers.flatMap(([x, y]): [number, number][] => [[x, y - 1], [x, y], [x, y + 1]]);
    const expected = centers.flatMap(([x, y]): [number, number][] => [[x - 1, y], [x, y], [x + 1, y]]);
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
});
