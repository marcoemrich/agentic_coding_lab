import { describe, it, expect } from "vitest";
import { nextGeneration, nextGenerationCells, type Cell } from "./game-of-life";

function cellsToSet(cells: Iterable<Cell>): Set<string> {
  const s = new Set<string>();
  for (const [x, y] of cells) s.add(`${x},${y}`);
  return s;
}

function expectSameCells(actual: Set<string>, expected: Cell[]): void {
  expect(actual).toEqual(cellsToSet(expected));
}

describe("nextGeneration", () => {
  it("an empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual(new Set());
  });

  it("a single living cell dies of underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual(new Set());
  });

  it("two adjacent living cells both die of underpopulation", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual(new Set());
  });

  it("a living cell with four neighbors dies of overpopulation", () => {
    // Center cell at (0,0) with 4 neighbors
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]);
    // The center cell (0,0) had 4 live neighbors -> dies
    expect(result.has("0,0")).toBe(false);
  });

  it("a dead cell with exactly three live neighbors becomes alive", () => {
    // Three cells around (0,0): the cell at (0,0) is dead but has 3 neighbors
    const result = nextGeneration([
      [1, 0],
      [-1, 0],
      [0, 1],
    ]);
    expect(result.has("0,0")).toBe(true);
  });

  it("a block (still life) remains unchanged", () => {
    const block: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("a blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("a blinker returns to its original state after two generations", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const gen1 = nextGenerationCells(horizontal);
    const gen2 = nextGenerationCells(gen1);
    expectSameCells(cellsToSet(gen2), horizontal);
  });

  it("handles negative coordinates", () => {
    // Blinker centered at (-100, -100)
    const horizontal: Cell[] = [
      [-101, -100],
      [-100, -100],
      [-99, -100],
    ];
    const vertical: Cell[] = [
      [-100, -101],
      [-100, -100],
      [-100, -99],
    ];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("uses sparse representation - cells far from any others die out", () => {
    // A cell at (1000000, -1000000) by itself dies, nothing else spontaneously appears
    const result = nextGeneration([[1_000_000, -1_000_000]]);
    expect(result.size).toBe(0);
  });

  it("a glider translates correctly after four generations", () => {
    // Glider starting position
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    // Run 4 generations; the glider should be offset by (1, 1)
    for (let i = 0; i < 4; i++) {
      const next = nextGeneration(cells);
      cells = Array.from(next).map((k) => {
        const [x, y] = k.split(",").map(Number);
        return [x, y];
      });
    }
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    expectSameCells(cellsToSet(cells), expected);
  });

  it("a living cell with two neighbors survives", () => {
    // Blinker: center cell has 2 neighbors, both end-cells have 1 neighbor each
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const result = nextGeneration(horizontal);
    // Center cell (0,0) had 2 live neighbors -> survives
    expect(result.has("0,0")).toBe(true);
  });

  it("a living cell with three neighbors survives", () => {
    // L-tromino: corner cell has 2 neighbors, the others have 2 each
    // Use a configuration where a live cell has exactly 3 neighbors
    const cells: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
      [2, 1], // extra cell adjacent to (1,0) and (1,1)
    ];
    // The cell at (1,0) has neighbors: (0,0),(0,1),(1,1),(2,1) = 4 -> dies
    // The cell at (1,1) has neighbors: (0,0),(1,0),(0,1),(2,1) = 4 -> dies
    // Let's check the cell at (0,0): neighbors (1,0),(0,1),(1,1) = 3 -> survives
    const result = nextGeneration(cells);
    expect(result.has("0,0")).toBe(true);
  });

  it("input duplicates are handled idempotently", () => {
    const result = nextGeneration([
      [0, 0], [0, 0],
      [1, 0],
      [0, 1],
    ]);
    // (0,0) has 2 neighbors -> lives. (1,1) is dead with 3 neighbors -> alive.
    expect(result.has("0,0")).toBe(true);
    expect(result.has("1,1")).toBe(true);
  });
});

describe("nextGenerationCells", () => {
  it("returns the next generation as [x, y] tuples", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const result = nextGenerationCells(horizontal);
    expect(result).toHaveLength(3);
    expectSameCells(cellsToSet(result), [
      [0, -1], [0, 0], [0, 1],
    ]);
  });

  it("returns an empty array for an empty input", () => {
    expect(nextGenerationCells([])).toEqual([]);
  });
});
