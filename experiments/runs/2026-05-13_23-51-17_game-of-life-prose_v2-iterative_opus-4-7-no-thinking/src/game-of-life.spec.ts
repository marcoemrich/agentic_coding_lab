import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Iterable<Cell>): string[] {
  return Array.from(cells)
    .map(([x, y]) => `${x},${y}`)
    .sort();
}

function expectSameCells(actual: Iterable<Cell>, expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration", () => {
  it("returns no living cells for an empty input", () => {
    expectSameCells(nextGeneration([]), []);
  });

  it("kills a lone living cell (underpopulation)", () => {
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

  it("a block is stable (still life)", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("a blinker rotates between horizontal and vertical", () => {
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
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("kills a cell with more than three live neighbors (overpopulation)", () => {
    // Plus-shape: center has 4 live neighbors -> dies
    const plus: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(plus);
    const keys = new Set(normalize(result));
    expect(keys.has("0,0")).toBe(false);
  });

  it("births a dead cell with exactly three live neighbors", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has 3 live neighbors -> born
    const shape: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(shape);
    const keys = new Set(normalize(result));
    expect(keys.has("1,1")).toBe(true);
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

  it("evolves a glider by one full step", () => {
    // Classic glider starting shape
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const expectedNext: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expectedNext);
  });

  it("returns a fresh result without mutating input", () => {
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const copy = input.map((c) => [...c] as Cell);
    nextGeneration(input);
    expect(input).toEqual(copy);
  });

  it("deduplicates duplicate input cells", () => {
    const block: Cell[] = [
      [0, 0],
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("handles large coordinates", () => {
    const blinker: Cell[] = [
      [1_000_000, 1_000_000],
      [1_000_001, 1_000_000],
      [1_000_002, 1_000_000],
    ];
    const expected: Cell[] = [
      [1_000_001, 999_999],
      [1_000_001, 1_000_000],
      [1_000_001, 1_000_001],
    ];
    expectSameCells(nextGeneration(blinker), expected);
  });
});
