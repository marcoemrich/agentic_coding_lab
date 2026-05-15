import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration", () => {
  it("returns no living cells when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone cell (underpopulation)", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("kills two adjacent cells (underpopulation)", () => {
    expectSameCells(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
      [],
    );
  });

  it("keeps a block (2x2 still life) stable", () => {
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

  it("oscillates a vertical blinker back to horizontal", () => {
    const vertical: Cell[] = [
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("kills overcrowded cells (overpopulation)", () => {
    // Center has 4 live neighbors -> dies
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(cells);
    const resultKeys = new Set(normalize(result));
    expect(resultKeys.has("0,0")).toBe(false);
  });

  it("births a dead cell with exactly three live neighbors", () => {
    // L-shape: (0,0), (1,0), (0,1) -> cell at (1,1) has exactly 3 live neighbors
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    const resultKeys = new Set(normalize(result));
    expect(resultKeys.has("1,1")).toBe(true);
  });

  it("handles negative coordinates correctly", () => {
    const blinker: Cell[] = [
      [-5, -5],
      [-4, -5],
      [-3, -5],
    ];
    const expected: Cell[] = [
      [-4, -6],
      [-4, -5],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("evolves a glider one step correctly", () => {
    // Glider initial position
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    // After one step glider becomes:
    const next: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), next);
  });

  it("does not produce duplicate cells in output", () => {
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const result = nextGeneration(cells);
    const keys = normalize(result);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("blinker on far-from-origin large coordinates", () => {
    const blinker: Cell[] = [
      [1000000, 1000000],
      [1000001, 1000000],
      [1000002, 1000000],
    ];
    const expected: Cell[] = [
      [1000001, 999999],
      [1000001, 1000000],
      [1000001, 1000001],
    ];
    expectSameCells(nextGeneration(blinker), expected);
  });
});
