import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the single cell [(0,0)] and returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to adjacent cells [(0,1),(1,1)] and returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps the Rule 2 example's center cell (1,1) alive with exactly 3 live neighbors", () => {
    const cells: [number, number][] = [[1, 1], [0, 0], [1, 0], [2, 0]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("applies reproduction to [(0,1),(1,1),(0,0)] and returns the four-cell block including (1,0)", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expectCells(next, [[0, 1], [1, 1], [0, 0], [1, 0]]);
  });
  it("applies overpopulation to the seven-cell Rule 3 example so its overcrowded center (1,1) dies", () => {
    const cells: [number, number][] = [[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("turns blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], exercising negative coordinates and survival with 2 neighbors", () => {
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expectCells(next, expected);
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)] after a second generation", () => {
    const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expectCells(next, expected);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged as a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
});
