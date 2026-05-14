import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell, key, toSet } from "./game-of-life.js";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => key(x, y)).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single live cell dies (underpopulation)", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it("a block (2x2) is stable (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("a blinker oscillates (horizontal -> vertical)", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    const set = toSet(next);
    expect(set.has(key(1, 1))).toBe(true);
  });

  it("live cell with four neighbors dies (overpopulation)", () => {
    // center cell at (0,0) with 4 neighbors
    const cells: Cell[] = [
      [0, 0],
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];
    const next = nextGeneration(cells);
    const set = toSet(next);
    expect(set.has(key(0, 0))).toBe(false);
  });

  it("live cell with exactly two neighbors survives", () => {
    // blinker: center cell has two neighbors, so survives
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const next = nextGeneration(horizontal);
    const set = toSet(next);
    expect(set.has(key(0, 0))).toBe(true);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-1000, -1000], [-999, -1000], [-998, -1000]];
    const expected: Cell[] = [[-999, -1001], [-999, -1000], [-999, -999]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("handles large coordinates", () => {
    const blinker: Cell[] = [[1_000_000, 1_000_000], [1_000_001, 1_000_000], [1_000_002, 1_000_000]];
    const expected: Cell[] = [
      [1_000_001, 999_999],
      [1_000_001, 1_000_000],
      [1_000_001, 1_000_001],
    ];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("glider moves diagonally after 4 generations", () => {
    let glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      glider = nextGeneration(glider);
    }
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    expectSameCells(glider, expected);
  });

  it("does not mutate the input", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const copy: Cell[] = input.map(([x, y]) => [x, y]);
    nextGeneration(input);
    expect(input).toEqual(copy);
  });

  it("returns no duplicate cells", () => {
    const blinker: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const next = nextGeneration(blinker);
    const keys = next.map(([x, y]) => key(x, y));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("tub is a still life", () => {
    const tub: Cell[] = [[1, 0], [0, 1], [2, 1], [1, 2]];
    expectSameCells(nextGeneration(tub), tub);
  });
});
