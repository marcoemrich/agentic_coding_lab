import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("blinker oscillator: vertical -> horizontal", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("blinker oscillator: horizontal -> vertical", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("blinker is period-2", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it("block is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("dead cell with exactly three neighbors becomes alive (reproduction)", () => {
    // L-shape of three cells; the empty corner should come alive.
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    // All four corners of 2x2 block should be alive
    expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it("live cell with four neighbors dies (overpopulation)", () => {
    // Center plus its four orthogonal neighbors
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(cells);
    // Center has 4 neighbors -> dies
    expect(result.find(([x, y]) => x === 0 && y === 0)).toBeUndefined();
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-100, -1], [-100, 0], [-100, 1]];
    const expected: Cell[] = [[-101, 0], [-100, 0], [-99, 0]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("glider moves correctly after one step", () => {
    // Standard glider
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const next = nextGeneration(glider);
    // Known next state of this glider
    const expected: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(next, expected);
  });

  it("does not produce duplicate cells", () => {
    const blinker: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const result = nextGeneration(blinker);
    const set = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(set.size).toBe(result.length);
  });

  it("beehive is a still life", () => {
    const beehive: Cell[] = [
      [1, 0],
      [2, 0],
      [0, 1],
      [3, 1],
      [1, 2],
      [2, 2],
    ];
    expectSameCells(nextGeneration(beehive), beehive);
  });
});
