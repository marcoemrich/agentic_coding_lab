import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  const keys = (cells: Cell[]) => cells.map(([x, y]) => `${x},${y}`).sort();
  expect(keys(actual)).toEqual(keys(expected));
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills an isolated live cell through underpopulation -- [(0,0)] becomes []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills two adjacent live cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("keeps live cells with exactly two neighbors and reproduces the missing corner -- a three-cell corner becomes a four-cell block", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps a live center cell with exactly three neighbors -- the four-cell T produces seven specified live cells", () => {
    expectCells(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]), [
      [-1, 0], [0, 0], [1, 0], [0, 1], [-1, 1], [1, 1], [0, -1],
    ]);
  });
  it("kills a live center cell with four neighbors through overpopulation -- a five-cell plus becomes the eight-cell ring", () => {
    expectCells(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]), [
      [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a four-cell block including (1,0)", () => {
    expectCells(nextGeneration([[0, 1], [1, 1], [0, 0]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps a four-cell block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("turns a vertical blinker into a horizontal blinker -- [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns a horizontal blinker back into a vertical blinker -- [(-1,1),(0,1),(1,1)] becomes [(0,0),(0,1),(0,2)]", () => {
    expectCells(nextGeneration([[-1, 1], [0, 1], [1, 1]]), [
      [0, 0], [0, 1], [0, 2],
    ]);
  });
  it("applies the rules to negative input coordinates -- a three-cell corner in the negative quadrant becomes a translated block", () => {
    expectCells(nextGeneration([[-2, -2], [-1, -2], [-2, -1]]), [
      [-2, -2], [-1, -2], [-2, -1], [-1, -1],
    ]);
  });
});
