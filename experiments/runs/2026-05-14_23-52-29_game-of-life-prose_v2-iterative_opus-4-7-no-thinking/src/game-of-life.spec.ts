import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const expectSameCells = (a: Cell[], b: Cell[]): void => {
  expect(sortCells(a)).toEqual(sortCells(b));
};

describe("nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single lonely cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (each has only one neighbor)", () => {
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

  it("blinker completes a full period after two generations", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it("block still life is stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("handles negative coordinates (block at negatives)", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expectSameCells(nextGeneration(block), block);
  });

  it("handles blinker at negative coordinates", () => {
    const vertical: Cell[] = [[-10, -11], [-10, -10], [-10, -9]];
    const horizontal: Cell[] = [[-11, -10], [-10, -10], [-9, -10]];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) -> (1,1) should be born
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });

  it("overpopulation: live cell with more than three live neighbors dies", () => {
    // Center cell with 4 live neighbors
    const cells: Cell[] = [
      [0, 0], // center
      [-1, 0], [1, 0], [0, -1], [0, 1], // 4 neighbors
    ];
    const result = nextGeneration(cells);
    // Center cell dies
    expect(result).not.toContainEqual([0, 0]);
  });

  it("glider moves diagonally after 4 generations", () => {
    // Standard glider
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      cells = nextGeneration(cells);
    }
    // After 4 generations, glider should be shifted by (1, 1)
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    expectSameCells(cells, expected);
  });

  it("does not produce duplicate cells in output", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const seen = new Set<string>();
    for (const [x, y] of result) {
      const k = `${x},${y}`;
      expect(seen.has(k)).toBe(false);
      seen.add(k);
    }
  });

  it("tub still life is stable", () => {
    const tub: Cell[] = [[1, 0], [0, 1], [2, 1], [1, 2]];
    expectSameCells(nextGeneration(tub), tub);
  });

  it("handles large coordinate values", () => {
    const vertical: Cell[] = [
      [1000000, 999999],
      [1000000, 1000000],
      [1000000, 1000001],
    ];
    const horizontal: Cell[] = [
      [999999, 1000000],
      [1000000, 1000000],
      [1000001, 1000000],
    ];
    expectSameCells(nextGeneration(vertical), horizontal);
  });
});
