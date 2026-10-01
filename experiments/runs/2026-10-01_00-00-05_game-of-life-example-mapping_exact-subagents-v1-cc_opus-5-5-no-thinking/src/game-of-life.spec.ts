import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const expectSameCells = (actual: Cell[], expected: Cell[]): void => {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
};

describe("Game of Life - nextGeneration", () => {
  it("should return no cells for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with three neighbors alive (survival)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("should kill a live cell with four neighbors (overpopulation)", () => {
    const plus: Cell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const ringAroundCenter: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];

    const next = nextGeneration(plus);

    expect(next).not.toContainEqual([1, 1]);
    expectSameCells(next, ringAroundCenter);
  });
  it("should bring a dead cell with exactly three neighbors to life (reproduction)", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    const next = nextGeneration(lShape);

    expectSameCells(next, block);
  });
  it("should keep a block unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    const next = nextGeneration(block);

    expectSameCells(next, block);
  });
  it("should turn a vertical blinker into a horizontal blinker including negative coordinates (oscillator)", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    const next = nextGeneration(vertical);

    expectSameCells(next, horizontal);

    const afterTwo = nextGeneration(next);

    expectSameCells(afterTwo, vertical);
  });
});
