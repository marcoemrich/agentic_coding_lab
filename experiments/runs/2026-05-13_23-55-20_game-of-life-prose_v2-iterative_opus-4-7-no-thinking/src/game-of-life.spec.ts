import { describe, it, expect } from "vitest";
import { nextGeneration, nextGenerationCells, type Cell } from "./game-of-life";

const toSortedArray = (set: Set<string>): [number, number][] =>
  [...set]
    .map((key): [number, number] => {
      const idx = key.indexOf(",");
      return [Number(key.slice(0, idx)), Number(key.slice(idx + 1))];
    })
    .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const sortCells = (cells: Cell[]): [number, number][] =>
  cells
    .map(([x, y]): [number, number] => [x, y])
    .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

describe("Game of Life - nextGeneration", () => {
  it("an empty grid stays empty", () => {
    const next = nextGeneration([]);
    expect(next.size).toBe(0);
  });

  it("a single live cell dies (underpopulation)", () => {
    const next = nextGeneration([[0, 0]]);
    expect(next.size).toBe(0);
  });

  it("two adjacent cells both die (underpopulation)", () => {
    const next = nextGeneration([[0, 0], [1, 0]]);
    expect(next.size).toBe(0);
  });

  it("a block (2x2) is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(toSortedArray(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("a blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];

    const afterOne = nextGeneration(horizontal);
    expect(toSortedArray(afterOne)).toEqual(sortCells(vertical));

    const afterTwo = nextGeneration(
      [...afterOne].map((k): Cell => {
        const idx = k.indexOf(",");
        return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
      })
    );
    expect(toSortedArray(afterTwo)).toEqual(sortCells(horizontal));
  });

  it("a live cell with more than three neighbors dies (overpopulation)", () => {
    // The center cell (0,0) has four live neighbors.
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const next = nextGeneration(cells);
    expect(next.has("0,0")).toBe(false);
  });

  it("a dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // Three cells in an L shape; the dead corner at (1,1) should become alive.
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(next.has("1,1")).toBe(true);
  });

  it("handles negative coordinates correctly (blinker centered at origin)", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const expectedVertical: Cell[] = [[0, -1], [0, 0], [0, 1]];

    expect(toSortedArray(nextGeneration(horizontal))).toEqual(
      sortCells(expectedVertical)
    );
  });

  it("handles cells at very large coordinates", () => {
    const blinker: Cell[] = [
      [1_000_000, 0],
      [1_000_001, 0],
      [1_000_002, 0],
    ];
    const expected: Cell[] = [
      [1_000_001, -1],
      [1_000_001, 0],
      [1_000_001, 1],
    ];
    expect(toSortedArray(nextGeneration(blinker))).toEqual(sortCells(expected));
  });

  it("a glider moves diagonally after four generations", () => {
    // Standard glider pattern
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      const next = nextGeneration(cells);
      cells = [...next].map((k): Cell => {
        const idx = k.indexOf(",");
        return [Number(k.slice(0, idx)), Number(k.slice(idx + 1))];
      });
    }
    // After 4 generations, a glider shifts by (1, 1).
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    expect(sortCells(cells)).toEqual(sortCells(expected));
  });

  it("ignores duplicates in the input", () => {
    const cells: Cell[] = [[0, 0], [0, 0], [1, 0], [2, 0]];
    const next = nextGeneration(cells);
    expect(toSortedArray(next)).toEqual(sortCells([[1, -1], [1, 0], [1, 1]]));
  });
});

describe("Game of Life - nextGenerationCells", () => {
  it("returns an array of cells equivalent to nextGeneration", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGenerationCells(cells);
    expect(sortCells(result)).toEqual(sortCells([[1, -1], [1, 0], [1, 1]]));
  });

  it("returns an empty array for an empty input", () => {
    expect(nextGenerationCells([])).toEqual([]);
  });
});
