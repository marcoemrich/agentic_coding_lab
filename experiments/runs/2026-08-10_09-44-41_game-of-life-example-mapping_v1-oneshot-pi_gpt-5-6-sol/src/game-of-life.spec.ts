import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(sorted(actual)).toEqual(sorted(expected));
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone cell through underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills cells that each have only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("lets a live cell survive with two neighbors", () => {
    expectCells(nextGeneration([[-1, 0], [0, 0], [1, 0]]), [
      [0, -1], [0, 0], [0, 1],
    ]);
  });

  it("lets a live cell survive with three neighbors", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([0, 0]);
  });

  it("kills a live cell with more than three neighbors", () => {
    const next = nextGeneration([
      [0, 0], [-1, 0], [1, 0], [0, -1], [0, 1],
    ]);
    expect(next).not.toContainEqual([0, 0]);
  });

  it("creates a cell that has exactly three neighbors", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });

  it("oscillates a blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });

  it("preserves a block still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it("supports patterns spanning negative coordinates", () => {
    expectCells(nextGeneration([[-2, -2], [-2, -1], [-2, 0]]), [
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });

  it("treats duplicate coordinates as one living cell", () => {
    expect(nextGeneration([[4, 7], [4, 7]])).toEqual([]);
  });
});
