import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([leftX, leftY], [rightX, rightY]) =>
    leftX === rightX ? leftY - rightY : leftX - rightX,
  );
}

describe("Game of Life - Next Generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    expect(sorted(nextGeneration([[0, 1], [1, 1], [0, 0]]))).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("preserves the live center when it has three neighbors -- next generation contains (1,1)", () => {
    const input: Cell[] = [[1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(input)).toContainEqual([1, 1]);
  });
  it("kills the overpopulated center from the pictured input -- next generation excludes (1,1)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(input)).not.toContainEqual([1, 1]);
  });
  it("keeps a 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)] is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("turns a vertical blinker into a horizontal blinker using negative coordinates -- [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the horizontal blinker back into the vertical blinker -- [(-1,1),(0,1),(1,1)] becomes [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual([
      [0, 0], [0, 1], [0, 2],
    ]);
  });
});
