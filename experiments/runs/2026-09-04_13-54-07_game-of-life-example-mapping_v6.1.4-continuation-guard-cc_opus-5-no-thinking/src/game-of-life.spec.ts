import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const expectSameCells = (actual: Cell[], expected: Cell[]): void => {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
};

describe("Game of Life - next generation", () => {
  // Simplest cases
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("kills both cells of a horizontal pair, each having 1 neighbor — [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // Rule 4 - Reproduction
  it("brings a dead cell with exactly 3 live neighbors to life — [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expectSameCells(result, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  // Rule 2 - Survival
  it("keeps a live cell with 2 live neighbors alive — centre of blinker [(0,0),(0,1),(0,2)] survives at (0,1)", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(result).toContainEqual([0, 1]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([0, 2]);
  });
  it("keeps a live cell with 3 live neighbors alive — block [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    const result = nextGeneration(block);

    expectSameCells(result, block);
  });

  // Rule 3 - Overpopulation
  it("kills live cells with more than 3 live neighbors — the centre and edges of a filled 3x3 square die, leaving the 4 corners plus 4 births outside", () => {
    const filledSquare: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];

    const result = nextGeneration(filledSquare);

    // Centre (1,1) has 8 neighbours and each edge midpoint has 5 — all die.
    expect(result).not.toContainEqual([1, 1]);
    expect(result).not.toContainEqual([1, 0]);
    expect(result).not.toContainEqual([0, 1]);
    expect(result).not.toContainEqual([2, 1]);
    expect(result).not.toContainEqual([1, 2]);

    // The 4 corners survive on 3 neighbours; 4 dead cells outside the square
    // have exactly 3 neighbours and are born.
    expectSameCells(result, [
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
      [-1, 1],
      [1, -1],
      [3, 1],
      [1, 3],
    ]);
  });

  // Infinite grid / negative coordinates
  it("handles negative coordinates — blinker [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expectSameCells(result, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  // Multi-step
  it("oscillates the blinker back to its original state after two generations — [(0,0),(0,1),(0,2)] -> ... -> [(0,0),(0,1),(0,2)]", () => {
    const generation0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const generation1 = nextGeneration(generation0);
    const generation2 = nextGeneration(generation1);

    expectSameCells(generation1, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expectSameCells(generation2, generation0);
  });
});
