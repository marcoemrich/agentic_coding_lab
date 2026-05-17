import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration - Rule 1: Underpopulation", () => {
  it("kills a single live cell with 0 neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent live cells with 1 neighbor each", () => {
    expectSameCells(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
      []
    );
  });
});

describe("nextGeneration - Rule 2: Survival", () => {
  it("a live cell with 2 neighbors survives", () => {
    // Blinker horizontal -> vertical, the center (0,0) had 2 neighbors and survives
    const result = nextGeneration([
      [-1, 0],
      [0, 0],
      [1, 0],
    ]);
    // Expected vertical blinker: (0,-1), (0,0), (0,1)
    expectSameCells(result, [
      [0, -1],
      [0, 0],
      [0, 1],
    ]);
  });

  it("a live cell with 3 neighbors survives", () => {
    // Block - each cell has 3 neighbors
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });
});

describe("nextGeneration - Rule 3: Overpopulation", () => {
  it("a live cell with more than 3 neighbors dies", () => {
    // Cross-like shape: center has 4 neighbors
    // # # #
    // . # .
    // # # #
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const result = nextGeneration(cells);
    // Center cell (1,1) had 6 neighbors -> dies
    const keys = normalize(result);
    expect(keys).not.toContain("1,1");
  });
});

describe("nextGeneration - Rule 4: Reproduction", () => {
  it("a dead cell with exactly 3 live neighbors becomes alive", () => {
    // Three cells: (0,0), (1,0), (0,1)
    // Dead cell (1,1) has 3 live neighbors -> alive
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expectSameCells(result, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("a dead cell with 2 live neighbors stays dead", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
    ]);
    // Neither (0,1) nor (1,1) have 3 neighbors; result should be empty
    expect(result).toEqual([]);
  });

  it("a dead cell with 4 live neighbors stays dead", () => {
    // Set up so dead cell (1,1) has 4 neighbors: (0,0),(2,0),(0,2),(2,2)
    const cells: Cell[] = [
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ];
    const result = nextGeneration(cells);
    const keys = normalize(result);
    expect(keys).not.toContain("1,1");
  });
});

describe("nextGeneration - Patterns", () => {
  it("blinker oscillates between horizontal and vertical", () => {
    // Per prompt: Gen 0: [(0,0), (0,1), (0,2)] -> Gen 1: [(-1,1), (0,1), (1,1)]
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    // Oscillates back
    const gen2 = nextGeneration(gen1);
    expectSameCells(gen2, gen0);
  });

  it("block remains unchanged (still life)", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("single cell dies", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("empty input returns empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });
});

describe("nextGeneration - Negative coordinates", () => {
  it("handles negative coordinates", () => {
    // Blinker at negative coords
    const gen0: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ]);
  });

  it("handles cells far from origin and across origin", () => {
    // Block straddling origin
    const block: Cell[] = [
      [-1, -1],
      [0, -1],
      [-1, 0],
      [0, 0],
    ];
    expectSameCells(nextGeneration(block), block);
  });
});

describe("nextGeneration - Glider", () => {
  it("moves a glider correctly", () => {
    // Standard glider
    // .#.
    // ..#
    // ###
    const gen0: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const gen1 = nextGeneration(gen0);
    // After one step:
    // ...
    // #.#
    // .##
    // .#.
    expectSameCells(gen1, [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ]);
  });
});

describe("nextGeneration - Input handling", () => {
  it("does not produce duplicate cells in output", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
