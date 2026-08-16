import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] when there are no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for one isolated living cell because it has 0 neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for two adjacent living cells because each has fewer than 2 neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a living cell with exactly 2 live neighbors", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a living cell with exactly 3 live neighbors", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("kills a living cell with 4 live neighbors", () => {
    expect(
      nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]),
    ).not.toContainEqual([0, 0]);
  });
  it("creates a living cell with exactly 3 live neighbors", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("does not create dead cells with only 2 live neighbors", () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it("evolves a blinker across negative coordinates to [[-1, 0], [0, 0], [1, 0]]", () => {
    const result = nextGeneration([[0, -1], [0, 0], [0, 1]]);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 0], [0, 0], [1, 0]]));
  });
  it("handles widely separated coordinates sparsely and returns []", () => {
    expect(
      nextGeneration([
        [-1_000_000, -1_000_000],
        [1_000_000, 1_000_000],
      ]),
    ).toEqual([]);
  });
});
