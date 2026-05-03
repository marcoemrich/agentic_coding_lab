import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe("nextGeneration", () => {
  it("returns no living cells for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both cells when only two cells are alive in isolation", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("a block (2x2) is a still life", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("a horizontal blinker becomes vertical", () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const vertical: Cell[] = [
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("a blinker oscillates back to its original state after two generations", () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const oneStep = nextGeneration(horizontal);
    const twoSteps = nextGeneration(oneStep);
    expectSameCells(twoSteps, horizontal);
  });

  it("dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // L-shape of 3 cells: (0,0),(1,0),(0,1)
    // (1,1) is dead but has all three as neighbors -> becomes alive
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    expect(toSet(result).has("1,1")).toBe(true);
  });

  it("living cell with four or more live neighbors dies (overpopulation)", () => {
    // Center (0,0) has 4 living neighbors
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(cells);
    expect(toSet(result).has("0,0")).toBe(false);
  });

  it("handles negative coordinates", () => {
    const cells: Cell[] = [
      [-10, -10],
      [-9, -10],
      [-8, -10],
    ];
    const expected: Cell[] = [
      [-9, -11],
      [-9, -10],
      [-9, -9],
    ];
    expectSameCells(nextGeneration(cells), expected);
  });

  it("does not mutate the input array", () => {
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const copy: Cell[] = cells.map(([x, y]) => [x, y]);
    nextGeneration(cells);
    expect(cells).toEqual(copy);
  });

  it("deduplicates input cells", () => {
    // A block, but with duplicates in input
    const block: Cell[] = [
      [0, 0],
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [1, 1],
    ];
    const expected: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), expected);
  });

  it("glider moves correctly after one generation", () => {
    // Standard glider
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expected);
  });
});
