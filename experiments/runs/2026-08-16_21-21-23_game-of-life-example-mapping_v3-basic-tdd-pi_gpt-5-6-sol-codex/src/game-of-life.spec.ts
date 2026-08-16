import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe("nextGeneration", () => {
  it("keeps an empty generation empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell through underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("keeps a live cell with two live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });

  it("makes a dead cell with exactly three live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });

  it("kills a live cell with more than three live neighbors", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });

  it("kills two cells that each have only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("preserves a block still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it("oscillates a blinker for two generations", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    const generationOne = nextGeneration(vertical);
    expectCells(generationOne, horizontal);
    expectCells(nextGeneration(generationOne), vertical);
  });

  it("handles patterns across negative coordinates", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expectCells(nextGeneration(block), block);
  });

  it("treats duplicate coordinates as one living cell", () => {
    expect(nextGeneration([[0, 0], [0, 0]])).toEqual([]);
  });
});
