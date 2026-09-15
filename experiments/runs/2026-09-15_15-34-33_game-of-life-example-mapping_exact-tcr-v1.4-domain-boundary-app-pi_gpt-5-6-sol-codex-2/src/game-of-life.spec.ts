import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
}

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent cells [(0,1),(1,1)] because each has one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) with exactly 3 live neighbors alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills the center cell (1,1) with exactly 4 live neighbors", () => {
    const next = nextGeneration([[1, 1], [1, 0], [2, 1], [1, 2], [0, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces the dead cell (1,1) with exactly 3 neighbors, producing [(0,1),(1,1),(0,0),(1,0)]", () => {
    const next = nextGeneration([[0, 1], [0, 0], [1, 0]]);
    expectCells(next, [[0, 1], [1, 1], [0, 0], [1, 0]]);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectCells(next, [[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns the blinker back to [(0,0),(0,1),(0,2)] after two generations", () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const afterTwo = nextGeneration(nextGeneration(initial));
    expectCells(afterTwo, initial);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
});
