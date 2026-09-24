import { describe, expect, it } from "vitest";

import { nextGeneration, type Cell } from "./game-of-life.js";

function sorted(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills the single cell [(0,0)] by underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills adjacent cells [(0,1),(1,1)] with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps the live center cell (1,1) with exactly three live neighbors alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills a live center cell with four live neighbors by overpopulation", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces at dead cell (1,1) with three neighbors, producing the 2x2 block", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
  it("turns the horizontal blinker back into the original vertical blinker", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });
  it("applies reproduction at negative x and y coordinates without a grid boundary", () => {
    const cells: Cell[] = [[-2, -2], [-1, -2], [-2, -1]];
    const expected: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });
  it("evolves cells at arbitrarily large coordinates without storing a bounded grid", () => {
    const x = 1_000_000_000;
    const y = -1_000_000_000;
    const vertical: Cell[] = [[x, y], [x, y + 1], [x, y + 2]];
    const horizontal: Cell[] = [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
});
