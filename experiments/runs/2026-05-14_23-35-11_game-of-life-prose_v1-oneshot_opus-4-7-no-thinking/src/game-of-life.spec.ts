import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills isolated single cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills a pair of cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const next = nextGeneration(horizontal);
    expect(normalize(next)).toEqual(normalize([[1, -1], [1, 0], [1, 1]]));

    const nextNext = nextGeneration(next);
    expect(normalize(nextNext)).toEqual(normalize(horizontal));
  });

  it("block is stable (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(normalize(nextGeneration(block))).toEqual(normalize(block));
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-1, -5], [0, -5], [1, -5]];
    const next = nextGeneration(blinker);
    expect(normalize(next)).toEqual(normalize([[0, -6], [0, -5], [0, -4]]));
  });

  it("kills a cell with more than three neighbors (overpopulation)", () => {
    // center cell at (0,0) with 4 neighbors
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const next = nextGeneration(cells);
    // (0,0) should be dead in next generation
    expect(next.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });

  it("births a dead cell with exactly three live neighbors", () => {
    // L-shape that should birth (1,1)
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it("glider moves diagonally after 4 generations", () => {
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      cells = nextGeneration(cells);
    }
    // After 4 generations, glider shifts by (1,1)
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    expect(normalize(cells)).toEqual(normalize(expected));
  });

  it("does not return duplicate cells", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const next = nextGeneration(cells);
    const keys = next.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
