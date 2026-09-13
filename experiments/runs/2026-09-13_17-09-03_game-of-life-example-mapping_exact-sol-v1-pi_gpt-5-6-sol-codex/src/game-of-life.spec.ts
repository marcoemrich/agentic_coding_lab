import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills a single live cell from underpopulation -- []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills two adjacent live cells with one neighbor each -- []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expectCells(
      nextGeneration([[-1, 0], [0, 0], [1, 0]]),
      [[0, -1], [0, 0], [0, 1]],
    );
  });
  it("keeps a live cell with exactly three live neighbors alive", () => {
    expectCells(
      nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1]]),
      [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1]],
    );
  });
  it("kills a live cell with more than three live neighbors", () => {
    expectCells(
      nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]),
      [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
    );
  });
  it("reproduces a dead cell with exactly three live neighbors -- a 2x2 block", () => {
    expectCells(
      nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    );
  });
  it("keeps a 2x2 block unchanged -- [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("oscillates a vertical blinker to horizontal and back to vertical", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });
  it("evolves a blinker across negative coordinates on the infinite grid", () => {
    expectCells(
      nextGeneration([[-2, -1], [-1, -1], [0, -1]]),
      [[-1, -2], [-1, -1], [-1, 0]],
    );
  });
});
