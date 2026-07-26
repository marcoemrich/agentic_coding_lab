import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";
import type { Cell } from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should apply underpopulation -- [(0,1), (1,1)] → [] (each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should apply survival -- center (1,1) with 3 neighbors lives on in ### / ... / .#.", () => {
    // (1,1) has neighbors (0,1), (2,1), (1,2) → 3 → survives
    const gen0: [number, number][] = [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ];
    const expected: [number, number][] = [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [0, 2],
      [2, 2],
      [1, 0],
    ];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(expected));
  });
  it("should apply overpopulation -- center (1,1) with 4 neighbors dies in ### / .#. / ###", () => {
    // Center (1,1) with 4 diagonal neighbors → dies; edge midpoints born with 3
    const gen0: Cell[] = [
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ];
    const expected: Cell[] = [
      [1, 0],
      [0, 1],
      [2, 1],
      [1, 2],
    ];
    const result = sortCells(nextGeneration(gen0));
    expect(result).not.toContainEqual([1, 1]);
    expect(result).toEqual(sortCells(expected));
  });
  it("should apply reproduction -- dead (1,1) with exactly 3 neighbors becomes alive in ##. / #.. / ...", () => {
    // Gen0: [(0,2), (1,2), (0,1)] → Gen1 includes born (1,1)
    const gen0: Cell[] = [
      [0, 2],
      [1, 2],
      [0, 1],
    ];
    const expected: Cell[] = [
      [0, 2],
      [1, 2],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(expected));
  });
  it("should keep block still life unchanged -- [(0,0), (1,0), (0,1), (1,1)] → same", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should oscillate blinker Gen0 to Gen1 -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(expected));
  });
});
