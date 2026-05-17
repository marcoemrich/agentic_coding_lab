import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration - Rule 1: Underpopulation", () => {
  it("kills a live cell with fewer than 2 live neighbors (two adjacent cells, each with 1 neighbor)", () => {
    const gen0: Cell[] = [[0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), []);
  });

  it("kills a lone live cell with 0 neighbors", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });
});

describe("nextGeneration - Rule 2: Survival", () => {
  it("keeps a live cell with 2 live neighbors alive", () => {
    // Blinker vertical -> horizontal: center cell (0,1) has 2 neighbors
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([0, 1]);
  });

  it("keeps a live cell with 3 live neighbors alive (example from spec)", () => {
    // ###
    // ...
    // .#.
    // center (1,1) has 3 neighbors
    const gen0: Cell[] = [[0, 2], [1, 2], [2, 2], [1, 0]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([1, 2]);
  });
});

describe("nextGeneration - Rule 3: Overpopulation", () => {
  it("kills a live cell with more than 3 live neighbors", () => {
    // ###
    // .#.
    // ###
    // center (1,1) has 4 live neighbors -> dies (here treating row index as y inverted but rule still holds)
    const gen0: Cell[] = [
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    const gen1 = nextGeneration(gen0);
    expect(gen1).not.toContainEqual([1, 1]);
  });
});

describe("nextGeneration - Rule 4: Reproduction", () => {
  it("brings a dead cell to life when it has exactly 3 live neighbors", () => {
    // ##.
    // #..
    // ...
    // dead cell (1,1) has 3 live neighbors -> born
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([1, 1]);
  });

  it("does not bring a dead cell to life with 2 live neighbors", () => {
    const gen0: Cell[] = [[0, 0], [2, 0]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).not.toContainEqual([1, 0]);
  });

  it("does not bring a dead cell to life with 4 live neighbors", () => {
    // four corners around (1,1)
    const gen0: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).not.toContainEqual([1, 1]);
  });
});

describe("nextGeneration - Patterns", () => {
  it("blinker oscillates from vertical to horizontal (spec example)", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
  });

  it("blinker oscillates back to vertical after two generations", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
  });

  it("block is a still life (unchanged)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("single cell dies", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("empty input produces empty output", () => {
    expectSameCells(nextGeneration([]), []);
  });
});

describe("nextGeneration - Infinite grid / negative coordinates", () => {
  it("handles negative coordinates", () => {
    // Blinker centered at negative coordinates
    const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
  });

  it("handles cells far apart without interaction", () => {
    // Two isolated single cells, each dies (no neighbors)
    const gen0: Cell[] = [[1000, 1000], [-1000, -1000]];
    expectSameCells(nextGeneration(gen0), []);
  });

  it("handles a blinker far from the origin", () => {
    const gen0: Cell[] = [[100, 100], [100, 101], [100, 102]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[99, 101], [100, 101], [101, 101]]);
  });
});

describe("nextGeneration - Output format", () => {
  it("returns cells as [x, y] tuples", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    for (const cell of result) {
      expect(cell).toHaveLength(2);
      expect(typeof cell[0]).toBe("number");
      expect(typeof cell[1]).toBe("number");
    }
  });

  it("does not contain duplicates", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2], [1, 1]]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
