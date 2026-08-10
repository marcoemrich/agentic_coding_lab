import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";
import type { Cell } from "./game-of-life.js";

describe("Conway's Game of Life next generation", () => {
  it("should export nextGeneration with the Cell[] tuple API — [(0, 0)] is accepted as Cell[] and the result is Cell[]", () => {
    const cells: Cell[] = [[0, 0]];
    const result: Cell[] = nextGeneration(cells);

    expect(result).toEqual([]);
  });

  it("should kill a single live cell by underpopulation — [(0, 0)] becomes [] because it has 0 neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent live cells by underpopulation — [(0, 1), (1, 1)] becomes [] because each has 1 neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should preserve a live cell with exactly 2 live neighbors — (0, 0) remains alive when the input is [(0, 0), (-1, 0), (1, 0)]", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });

  it("should preserve a live cell with exactly 3 live neighbors — (0, 0) remains alive when the input is [(0, 0), (-1, 0), (1, 0), (0, 1)]", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });

  it("should kill a live cell with more than 3 live neighbors — (0, 0) is absent from the next generation when it has 4 neighbors at [(-1, 0), (1, 0), (0, -1), (0, 1)]", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });

  it("should apply overpopulation to the supplied 7-cell arrangement — center (1, 1) dies from its 6 neighbors in [(0, 2), (1, 2), (2, 2), (1, 1), (0, 0), (1, 0), (2, 0)]", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toEqual([
      [0, 2], [2, 2],
      [0, 1], [2, 1],
      [0, 0], [2, 0],
    ]);
  });

  it("should reproduce a dead cell with exactly 3 live neighbors — [(0, 1), (1, 1), (0, 0)] becomes [(0, 0), (1, 0), (0, 1), (1, 1)] including newborn (1, 0)", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it("should keep the 2x2 block still life unchanged — [(0, 0), (1, 0), (0, 1), (1, 1)] remains the same 4 living cells", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it("should rotate a vertical blinker into a horizontal blinker after 1 generation — [(0, 0), (0, 1), (0, 2)] becomes [(-1, 1), (0, 1), (1, 1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });

  it("should return a blinker to its original state after 2 generations — [(0, 0), (0, 1), (0, 2)] becomes [(0, 0), (0, 1), (0, 2)] after two nextGeneration calls", () => {
    const firstGeneration = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const secondGeneration = nextGeneration(firstGeneration);

    expect(secondGeneration).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  it("should apply reproduction and survival at negative x and y coordinates on the infinite sparse grid — [(-2, -1), (-1, -1), (-2, -2)] becomes [(-2, -2), (-1, -2), (-2, -1), (-1, -1)]", () => {
    expect(nextGeneration([[-2, -1], [-1, -1], [-2, -2]])).toEqual([
      [-2, -2], [-1, -2], [-2, -1], [-1, -1],
    ]);
  });
});

// These references keep the API imports explicit in the test-list phase.
void expect;
void nextGeneration;
const cellApiContract: Cell = [0, 0];
void cellApiContract;
