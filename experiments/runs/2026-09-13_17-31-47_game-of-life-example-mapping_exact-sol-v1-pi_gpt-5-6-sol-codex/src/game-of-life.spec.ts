import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)]", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent cells [(0,1),(1,1)] with one neighbor each", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toEqual(
      expect.arrayContaining([[1, 0]]),
    );
  });
  it("keeps a live cell with exactly three live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [0, -1], [1, 0]])).toEqual(
      expect.arrayContaining([[0, 0]]),
    );
  });
  it("turns the L-shape [(0,1),(1,1),(0,0)] into block [(0,1),(1,1),(0,0),(1,0)]", () => {
    const result = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 1], [1, 1], [0, 0], [1, 0]]));
  });
  it("removes a live cell with exactly four live neighbors", () => {
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(result).not.toContainEqual([0, 0]);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns horizontal blinker [(-1,1),(0,1),(1,1)] back into [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block.map(([x, y]) => [x, y]));

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
});
