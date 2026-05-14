import { describe, it, expect } from "vitest";
import {
  cellKey,
  parseKey,
  cellsToSet,
  setToCells,
  nextGeneration,
  nextGenerationFromCells,
  type Cell,
} from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

describe("cellKey / parseKey", () => {
  it("round-trips positive coordinates", () => {
    expect(parseKey(cellKey(3, 5))).toEqual([3, 5]);
  });

  it("round-trips negative coordinates", () => {
    expect(parseKey(cellKey(-7, -2))).toEqual([-7, -2]);
  });

  it("round-trips mixed coordinates including zero", () => {
    expect(parseKey(cellKey(0, -100))).toEqual([0, -100]);
    expect(parseKey(cellKey(-1, 0))).toEqual([-1, 0]);
  });
});

describe("nextGeneration - rules", () => {
  it("an empty world stays empty", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });

  it("a single live cell dies (underpopulation)", () => {
    const living = cellsToSet([[0, 0]]);
    expect(nextGeneration(living).size).toBe(0);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    const living = cellsToSet([[0, 0], [1, 0]]);
    expect(nextGeneration(living).size).toBe(0);
  });

  it("a live cell with two live neighbors survives", () => {
    // Blinker (horizontal): becomes vertical, but middle cell has 2 neighbors and survives
    const living = cellsToSet([[0, 0], [1, 0], [2, 0]]);
    const next = nextGeneration(living);
    expect(next.has(cellKey(1, 0))).toBe(true);
  });

  it("a live cell with more than three live neighbors dies (overpopulation)", () => {
    // Center cell surrounded by 4 live neighbors
    const living = cellsToSet([
      [0, 0], // center
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ]);
    const next = nextGeneration(living);
    expect(next.has(cellKey(0, 0))).toBe(false);
  });

  it("a dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    const living = cellsToSet([[0, 0], [1, 0], [0, 1]]);
    const next = nextGeneration(living);
    // Cell (1, 1) is dead, has exactly 3 live neighbors
    expect(next.has(cellKey(1, 1))).toBe(true);
  });
});

describe("nextGeneration - patterns", () => {
  it("block (still life) is stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const living = cellsToSet(block);
    const next = nextGeneration(living);
    expect(sortCells(setToCells(next))).toEqual(sortCells(block));
  });

  it("blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];

    const gen1 = nextGeneration(cellsToSet(horizontal));
    expect(sortCells(setToCells(gen1))).toEqual(sortCells(vertical));

    const gen2 = nextGeneration(gen1);
    expect(sortCells(setToCells(gen2))).toEqual(sortCells(horizontal));
  });

  it("beehive (still life) is stable", () => {
    const beehive: Cell[] = [
      [1, 0], [2, 0],
      [0, 1], [3, 1],
      [1, 2], [2, 2],
    ];
    const next = nextGeneration(cellsToSet(beehive));
    expect(sortCells(setToCells(next))).toEqual(sortCells(beehive));
  });

  it("toad oscillates with period 2", () => {
    const phase1: Cell[] = [
      [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1],
    ];
    const gen1 = nextGeneration(cellsToSet(phase1));
    const gen2 = nextGeneration(gen1);
    expect(sortCells(setToCells(gen2))).toEqual(sortCells(phase1));
  });

  it("glider translates by (1, 1) after 4 generations", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    let state = cellsToSet(glider);
    for (let i = 0; i < 4; i++) {
      state = nextGeneration(state);
    }
    const expected: Cell[] = glider.map(([x, y]) => [x + 1, y + 1]);
    expect(sortCells(setToCells(state))).toEqual(sortCells(expected));
  });
});

describe("nextGeneration - negative coordinates", () => {
  it("handles a blinker at negative coordinates", () => {
    const horizontal: Cell[] = [[-10, -10], [-9, -10], [-8, -10]];
    const vertical: Cell[] = [[-9, -11], [-9, -10], [-9, -9]];
    const next = nextGeneration(cellsToSet(horizontal));
    expect(sortCells(setToCells(next))).toEqual(sortCells(vertical));
  });

  it("handles a block straddling the origin", () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const next = nextGeneration(cellsToSet(block));
    expect(sortCells(setToCells(next))).toEqual(sortCells(block));
  });

  it("handles very large negative coordinates", () => {
    const horizontal: Cell[] = [
      [-1000000, 500000],
      [-999999, 500000],
      [-999998, 500000],
    ];
    const next = nextGeneration(cellsToSet(horizontal));
    expect(next.has(cellKey(-999999, 500000))).toBe(true);
    expect(next.has(cellKey(-999999, 499999))).toBe(true);
    expect(next.has(cellKey(-999999, 500001))).toBe(true);
    expect(next.size).toBe(3);
  });
});

describe("nextGenerationFromCells", () => {
  it("returns an array of cells for the next generation (blinker)", () => {
    const result = nextGenerationFromCells([[0, 0], [1, 0], [2, 0]]);
    expect(sortCells(result)).toEqual(sortCells([[1, -1], [1, 0], [1, 1]]));
  });

  it("returns empty array for empty input", () => {
    expect(nextGenerationFromCells([])).toEqual([]);
  });

  it("returns empty array for a single cell", () => {
    expect(nextGenerationFromCells([[5, 5]])).toEqual([]);
  });
});
