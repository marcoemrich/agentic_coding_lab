import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the single live cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells at (0,1) and (1,1) with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const nextCells = nextGeneration([[0, 0], [-1, 0], [1, 0]]);

    expect(nextCells).toContainEqual([0, 0]);
  });
  it("keeps the Rule 2 focal live cell with exactly 3 live neighbors alive", () => {
    const nextCells = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(nextCells).toContainEqual([0, 0]);
  });
  it("kills the Rule 3 focal live cell with more than 3 live neighbors", () => {
    const nextCells = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(nextCells).not.toContainEqual([0, 0]);
  });
  it("reproduces a dead cell at (1,1) with exactly 3 live neighbors", () => {
    const nextCells = nextGeneration([[0, 1], [0, 0], [1, 0]]);

    expect(nextCells).toHaveLength(4);
    expect(nextCells).toContainEqual([1, 1]);
  });
  it("keeps the block at (0,0), (1,0), (0,1), and (1,1) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const nextCells = nextGeneration(block);

    expect(nextCells).toHaveLength(block.length);
    expect(nextCells).toEqual(expect.arrayContaining(block));
  });
  it("turns the vertical blinker at x=0 into the horizontal blinker spanning negative and positive x", () => {
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const nextCells = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(nextCells).toHaveLength(expected.length);
    expect(nextCells).toEqual(expect.arrayContaining(expected));
  });
  it("turns the horizontal blinker back into the vertical blinker after a second generation", () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const afterTwoGenerations = nextGeneration(nextGeneration(initial));

    expect(afterTwoGenerations).toHaveLength(initial.length);
    expect(afterTwoGenerations).toEqual(expect.arrayContaining(initial));
  });
});
