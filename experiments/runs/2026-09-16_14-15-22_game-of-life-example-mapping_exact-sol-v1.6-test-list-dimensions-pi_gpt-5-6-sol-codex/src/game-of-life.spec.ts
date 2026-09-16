import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a lone live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live center cell (1,1) with exactly 3 live neighbors alive", () => {
    const cells = [[1, 1], [0, 0], [1, 0], [2, 0]] as [number, number][];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("kills a live center cell (1,1) with exactly 4 live neighbors", () => {
    const cells = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]] as [number, number][];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("creates dead cell (1,1) with exactly 3 live neighbors -- three-cell corner becomes a four-cell block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expectCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("advances vertical blinker [(0,0),(0,1),(0,2)] to horizontal [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(next, [[-1, 1], [0, 1], [1, 1]]);
  });
  it("advances the horizontal blinker back to the original vertical blinker on generation 2", () => {
    const generationOne = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const generationTwo = nextGeneration(generationOne);

    expectCells(generationTwo, [[0, 0], [0, 1], [0, 2]]);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("handles an unbounded negative-coordinate blinker -- cells are born at x=-2 and x=0 around x=-1", () => {
    const next = nextGeneration([[-1, 0], [-1, 1], [-1, 2]]);

    expectCells(next, [[-2, 1], [-1, 1], [0, 1]]);
  });
});
