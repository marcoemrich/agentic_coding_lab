import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps the live center cell (1,1) with exactly three live neighbors alive", () => {
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(result).toContainEqual([1, 1]);
  });
  it("kills the live center cell (1,1) with exactly four live neighbors", () => {
    const result = nextGeneration([[1, 1], [1, 0], [2, 1], [1, 2], [0, 1]]);

    expect(result).not.toContainEqual([1, 1]);
  });
  it("reproduces at dead cell (1,1) with exactly three neighbors -- an L becomes a 2x2 block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns the horizontal blinker back into the vertical blinker after a second generation", () => {
    const result = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const result = nextGeneration(block);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("handles sparse cells at large negative coordinates without finite-grid bounds", () => {
    const result = nextGeneration([
      [-1_000_000, -1_000_000],
      [-999_999, -1_000_000],
      [-1_000_000, -999_999],
    ]);
    const expected = [
      [-1_000_000, -1_000_000],
      [-999_999, -1_000_000],
      [-1_000_000, -999_999],
      [-999_999, -999_999],
    ];

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
