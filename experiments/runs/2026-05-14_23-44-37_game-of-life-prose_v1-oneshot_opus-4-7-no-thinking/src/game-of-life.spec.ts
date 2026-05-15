import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration", () => {
  it("returns no cells when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (underpopulation)", () => {
    expectSameCells(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
      []
    );
  });

  it("keeps a 2x2 block stable (still life)", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("oscillates a horizontal blinker into a vertical blinker", () => {
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

  it("blinker returns to the original shape after two generations", () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    expectSameCells(nextGeneration(nextGeneration(horizontal)), horizontal);
  });

  it("kills a live cell with four or more live neighbors (overpopulation)", () => {
    // Center [0,0] has neighbors at [-1,0],[1,0],[0,-1],[0,1] => 4 neighbors
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const next = nextGeneration(cells);
    expect(next.find(([x, y]) => x === 0 && y === 0)).toBeUndefined();
  });

  it("births a dead cell with exactly three live neighbors", () => {
    // Three cells in an L-shape: [0,0],[1,0],[0,1]
    // The dead cell at [1,1] has three live neighbors and should become alive.
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it("handles negative coordinates correctly", () => {
    // Blinker at negative coordinates
    const horizontal: Cell[] = [
      [-5, -5],
      [-4, -5],
      [-3, -5],
    ];
    const vertical: Cell[] = [
      [-4, -6],
      [-4, -5],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("evolves a glider to its next phase", () => {
    // Standard glider configuration
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

  it("does not produce duplicate cells in the output", () => {
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const next = nextGeneration(cells);
    const keys = next.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
