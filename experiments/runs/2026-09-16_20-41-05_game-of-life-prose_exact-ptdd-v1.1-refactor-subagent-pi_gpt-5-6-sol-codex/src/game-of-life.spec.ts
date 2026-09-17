import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns no living cells when the current generation is empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a lone living cell with zero live neighbors by underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent living cells with one live neighbor each by underpopulation -- []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a living cell with exactly two live neighbors alive -- includes [0, 0]", () => {
    const nextCells = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(nextCells).toContainEqual([0, 0]);
  });
  it("keeps a living cell with exactly three live neighbors alive -- includes [0, 0]", () => {
    const nextCells = nextGeneration([[-1, 0], [0, 0], [1, 0], [0, 1]]);

    expect(nextCells).toContainEqual([0, 0]);
  });
  it("kills a living cell with four live neighbors by overpopulation -- excludes [0, 0]", () => {
    const nextCells = nextGeneration([[-1, 0], [0, 0], [1, 0], [0, -1], [0, 1]]);

    expect(nextCells).not.toContainEqual([0, 0]);
  });
  it("keeps a dead cell with only two live neighbors dead -- excludes [0, 0]", () => {
    const nextCells = nextGeneration([[-1, 0], [1, 0]]);

    expect(nextCells).not.toContainEqual([0, 0]);
  });
  it("makes a dead cell with exactly three live neighbors alive by reproduction -- includes [0, 0]", () => {
    const nextCells = nextGeneration([[-1, 0], [0, -1], [1, 0]]);

    expect(nextCells).toContainEqual([0, 0]);
  });
  it("evolves a horizontal blinker into the complete vertical blinker -- [[0, -1], [0, 0], [0, 1]]", () => {
    const nextCells = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    const expectedCells = [[0, -1], [0, 0], [0, 1]];

    expect(nextCells).toHaveLength(expectedCells.length);
    expect(nextCells).toEqual(expect.arrayContaining(expectedCells));
  });
  it("handles negative coordinates on the infinite grid -- a blinker centered at [-2, -3]", () => {
    const nextCells = nextGeneration([[-3, -3], [-2, -3], [-1, -3]]);
    const expectedCells = [[-2, -4], [-2, -3], [-2, -2]];

    expect(nextCells).toHaveLength(expectedCells.length);
    expect(nextCells).toEqual(expect.arrayContaining(expectedCells));
  });
});
