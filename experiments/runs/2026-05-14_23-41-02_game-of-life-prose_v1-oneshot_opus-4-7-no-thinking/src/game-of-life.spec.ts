import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("returns no live cells when there are none", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("a block (still life) remains stable", () => {
    const block: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("a blinker (oscillator) flips between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expect(normalize(nextGeneration(horizontal))).toEqual(normalize(vertical));
    expect(normalize(nextGeneration(vertical))).toEqual(normalize(horizontal));
  });

  it("dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // L-shape: three cells, each pair of two has a common neighbor.
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = normalize(nextGeneration(cells));
    // The corner (1,1) is born; the three originals each have 2 neighbors so survive.
    expect(result).toEqual(normalize([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("living cell with more than three neighbors dies (overpopulation)", () => {
    // Center plus four orthogonal neighbors: center has 4 neighbors -> dies.
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = new Set(normalize(nextGeneration(cells)));
    expect(result.has("0,0")).toBe(false);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-1, -5], [0, -5], [1, -5]];
    const expected: Cell[] = [[0, -6], [0, -5], [0, -4]];
    expect(normalize(nextGeneration(blinker))).toEqual(normalize(expected));
  });

  it("glider advances correctly after one generation", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1], [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expect(normalize(nextGeneration(glider))).toEqual(normalize(expected));
  });

  it("returns unique cells without duplicates", () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(blinker);
    const set = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(set.size).toBe(result.length);
  });

  it("works with very large coordinates", () => {
    const big = 1_000_000;
    const blinker: Cell[] = [[big, big], [big + 1, big], [big + 2, big]];
    const expected: Cell[] = [[big + 1, big - 1], [big + 1, big], [big + 1, big + 1]];
    expect(normalize(nextGeneration(blinker))).toEqual(normalize(expected));
  });
});
