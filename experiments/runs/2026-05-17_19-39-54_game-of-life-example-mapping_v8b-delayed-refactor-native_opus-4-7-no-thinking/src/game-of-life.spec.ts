import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration - Rule 1: Underpopulation", () => {
  it("kills a live cell with fewer than 2 neighbors (two cells, each with 1 neighbor)", () => {
    const gen0: Cell[] = [[0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), []);
  });

  it("kills a single isolated cell", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("returns empty for empty input", () => {
    expectSameCells(nextGeneration([]), []);
  });
});

describe("nextGeneration - Rule 2: Survival", () => {
  it("a live cell with exactly 2 neighbors survives", () => {
    // Block: each cell has 3 neighbors, all survive (this also tests survival with 3)
    // L-shape: (0,0),(1,0),(0,1) - (0,0) has 2 neighbors (1,0)+(0,1), survives
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(gen0);
    expect(next.some(([x, y]) => x === 0 && y === 0)).toBe(true);
  });

  it("a live cell with exactly 3 neighbors survives (block cell)", () => {
    // In a 2x2 block, each cell has 3 neighbors -> all survive
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next.some(([x, y]) => x === 0 && y === 0)).toBe(true);
  });
});

describe("nextGeneration - Rule 3: Overpopulation", () => {
  it("a live cell with more than 3 neighbors dies", () => {
    // Gen 0:
    //  ###
    //  .#.
    //  ###
    // Center (1,1) has 4 neighbors -> dies
    const gen0: Cell[] = [
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    const next = nextGeneration(gen0);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
});

describe("nextGeneration - Rule 4: Reproduction", () => {
  it("a dead cell with exactly 3 live neighbors becomes alive", () => {
    // Gen 0:
    //  ##.
    //  #..
    //  ...
    // Dead cell (1,1) has exactly 3 live neighbors -> alive
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const next = nextGeneration(gen0);
    expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    // Expected result per prompt:
    //  ##.
    //  ##.
    //  ...
    expectSameCells(next, [[0, 2], [1, 2], [0, 1], [1, 1]]);
  });
});

describe("nextGeneration - patterns", () => {
  it("blinker oscillates: vertical -> horizontal", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
  });

  it("blinker oscillates back to vertical after two generations", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
  });

  it("block (still life) is unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("single cell dies", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });
});

describe("nextGeneration - infinite grid / negative coordinates", () => {
  it("handles negative coordinates", () => {
    // Blinker centered at negative coordinates
    const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
  });

  it("works on a block straddling the origin in negative space", () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expectSameCells(nextGeneration(block), block);
  });

  it("does not duplicate cells in output", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(gen0);
    const keys = next.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
