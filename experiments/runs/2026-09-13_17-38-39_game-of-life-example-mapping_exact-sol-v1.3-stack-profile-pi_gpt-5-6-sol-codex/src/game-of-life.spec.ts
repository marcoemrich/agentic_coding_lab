import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([leftX, leftY], [rightX, rightY]) =>
    leftX === rightX ? leftY - rightY : leftX - rightX,
  );
}

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(sorted(actual)).toEqual(sorted(expected));
}

describe("Game of Life - Next Generation", () => {
  it("keeps an empty generation empty -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills a single live cell by underpopulation -- [(0,0)] becomes []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("keeps a live center cell with exactly 2 neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live center cell with exactly 3 neighbors alive", () => {
    expect(nextGeneration([[0, 0], [0, 1], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("kills a live center cell with 4 neighbors by overpopulation", () => {
    const cross: Cell[] = [[0, 0], [0, 1], [0, -1], [-1, 0], [1, 0]];
    expect(nextGeneration(cross)).not.toContainEqual([0, 0]);
  });
  it("births dead (1,1) with exactly 3 neighbors -- L shape becomes a 2x2 block", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("keeps the 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("oscillates a blinker through negative coordinates and back in two generations", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });
});
