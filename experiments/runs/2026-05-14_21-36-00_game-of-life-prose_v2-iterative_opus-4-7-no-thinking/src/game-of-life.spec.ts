import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const normalize = (cells: Cell[]): string[] =>
  cells.map(([x, y]) => `${x},${y}`).sort();

const expectSameCells = (actual: Cell[], expected: Cell[]) => {
  expect(normalize(actual)).toEqual(normalize(expected));
};

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (both have only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("blinker oscillator: vertical becomes horizontal", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("blinker oscillator: horizontal becomes vertical", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("blinker oscillates back to original after 2 generations", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const next = nextGeneration(vertical);
    const back = nextGeneration(next);
    expectSameCells(back, vertical);
  });

  it("block (still life) remains stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("handles negative coordinates", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expectSameCells(nextGeneration(block), block);
  });

  it("dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-shape: three cells around (1, 0)
    const cells: Cell[] = [[0, 0], [0, 1], [1, 1]];
    const next = nextGeneration(cells);
    // (1, 0) has neighbors (0, 0), (0, 1), (1, 1) → 3, becomes alive
    expect(normalize(next)).toContain("1,0");
  });

  it("live cell with 4+ live neighbors dies (overpopulation)", () => {
    // Center cell with 4 neighbors
    const cells: Cell[] = [
      [0, 0],
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];
    const next = nextGeneration(cells);
    expect(normalize(next)).not.toContain("0,0");
  });

  it("glider moves diagonally after 4 generations", () => {
    // Classic glider
    let cells: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    for (let i = 0; i < 4; i++) {
      cells = nextGeneration(cells);
    }
    // After 4 generations, glider has moved by (1, 1)
    const expected: Cell[] = [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]];
    expectSameCells(cells, expected);
  });

  it("does not return duplicates", () => {
    const blinker: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const result = nextGeneration(blinker);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("works with large coordinates", () => {
    const block: Cell[] = [
      [1_000_000, 1_000_000],
      [1_000_001, 1_000_000],
      [1_000_000, 1_000_001],
      [1_000_001, 1_000_001],
    ];
    expectSameCells(nextGeneration(block), block);
  });
});
