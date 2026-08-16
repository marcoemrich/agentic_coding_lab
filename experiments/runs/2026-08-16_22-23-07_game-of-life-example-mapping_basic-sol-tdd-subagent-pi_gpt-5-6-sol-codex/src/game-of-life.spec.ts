import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual.map(String).sort()).toEqual(expected.map(String).sort());
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("kills a single cell at (0,0) -- []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("kills two adjacent cells from underpopulation -- []", () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("keeps a live center cell with exactly 2 neighbors alive", () => {
    const next = nextGeneration([[-1, -1], [0, 0], [1, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps a live center cell with exactly 3 neighbors alive", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [0, 1], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("kills a live center cell with more than 3 neighbors", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [0, 1], [1, 0], [0, -1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces dead (1,1) with exactly 3 neighbors -- a four-cell block", () => {
    expectCells(
      nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    );
  });
  it("keeps the four-cell block unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expectCells(nextGeneration(block), block);
  });
  it("oscillates a blinker vertical to horizontal to vertical across negative coordinates", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    const generationOne = nextGeneration(vertical);
    expectCells(generationOne, horizontal);
    expectCells(nextGeneration(generationOne), vertical);
  });
});
