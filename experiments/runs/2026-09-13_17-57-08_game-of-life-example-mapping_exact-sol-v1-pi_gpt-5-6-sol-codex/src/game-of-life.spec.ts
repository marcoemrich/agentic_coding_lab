import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([leftX, leftY], [rightX, rightY]) =>
    leftY === rightY ? leftX - rightX : leftY - rightY,
  );

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills a single live cell -- [(0,0)] becomes []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    expectCells(
      nextGeneration([[0, 1], [1, 1], [0, 0]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    );
  });
  it("preserves the center cell with three neighbors -- formal rules yield two live rows", () => {
    expectCells(
      nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]]),
      [[0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2], [1, 3]],
    );
  });
  it("kills the center cell with more than three neighbors -- the specified overpopulation example becomes two live columns", () => {
    expectCells(
      nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]),
      [[1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3]],
    );
  });
  it("preserves a block still life -- the four coordinates are unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("turns a vertical blinker into a horizontal blinker -- output includes (-1,1)", () => {
    expectCells(
      nextGeneration([[0, 0], [0, 1], [0, 2]]),
      [[-1, 1], [0, 1], [1, 1]],
    );
  });
  it("turns the horizontal blinker back into the vertical blinker -- generation 2 equals generation 0", () => {
    expectCells(
      nextGeneration([[-1, 1], [0, 1], [1, 1]]),
      [[0, 0], [0, 1], [0, 2]],
    );
  });
});
