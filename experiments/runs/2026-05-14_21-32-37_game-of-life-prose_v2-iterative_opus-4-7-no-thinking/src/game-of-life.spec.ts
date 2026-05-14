import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration", () => {
  it("returns an empty array for an empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two live cells with only one neighbor each", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("keeps a block (2x2) stable", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("oscillates a blinker (vertical -> horizontal)", () => {
    const vertical: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    const horizontal: Cell[] = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    expectSameCells(nextGeneration(vertical), horizontal);
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("kills a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center has 4 neighbors
    const cells: Cell[] = [
      [0, 0], // center
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("0,0")).toBe(false);
  });

  it("births a dead cell with exactly 3 live neighbors", () => {
    // L-shape: (0,0), (1,0), (0,1). Position (1,1) is dead with 3 live neighbors -> becomes alive.
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(true);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [
      [-5, -5],
      [-5, -6],
      [-5, -4],
    ];
    const expected: Cell[] = [
      [-6, -5],
      [-5, -5],
      [-4, -5],
    ];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("translates a glider correctly after one generation", () => {
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

  it("does not produce duplicate cells in the output", () => {
    const blinker: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    const result = nextGeneration(blinker);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
