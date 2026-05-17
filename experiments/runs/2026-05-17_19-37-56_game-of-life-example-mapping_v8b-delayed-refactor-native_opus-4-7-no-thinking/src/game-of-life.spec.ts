import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration - Conway's Game of Life", () => {
  describe("Rule 1: Underpopulation", () => {
    it("kills a live cell with no neighbors", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it("kills both cells in a pair (each has 1 neighbor)", () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it("returns empty for empty input", () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe("Rule 2: Survival", () => {
    it("a live cell with 2 neighbors survives", () => {
      // Blinker center: (0,1) has neighbors (0,0) and (0,2)
      const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expect(next).toEqual(expect.arrayContaining([[0, 1]]));
    });

    it("a live cell with 3 neighbors survives (block still life)", () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Rule 3: Overpopulation", () => {
    it("kills a live cell with more than 3 neighbors", () => {
      // Center cell at (1,1) surrounded by 8 neighbors -> dies
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const next = nextGeneration(cells);
      // (1,1) should not be in the result
      expect(next).not.toEqual(expect.arrayContaining([[1, 1]]));
    });
  });

  describe("Rule 4: Reproduction", () => {
    it("a dead cell with exactly 3 live neighbors becomes alive", () => {
      // L-shape: (0,0),(1,0),(0,1) - dead cell (1,1) has 3 neighbors -> becomes alive
      const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expectSameCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });

    it("a dead cell with 2 neighbors stays dead", () => {
      // Two cells: (0,0) and (2,0) - cell (1,0) has 2 neighbors, stays dead
      const next = nextGeneration([[0, 0], [2, 0]]);
      expect(next).not.toEqual(expect.arrayContaining([[1, 0]]));
    });

    it("a dead cell with 4 neighbors stays dead", () => {
      // (0,0),(2,0),(0,2),(2,2) all neighbors of (1,1) -> stays dead
      const next = nextGeneration([[0, 0], [2, 0], [0, 2], [2, 2]]);
      expect(next).not.toEqual(expect.arrayContaining([[1, 1]]));
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker becomes horizontal", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
    });

    it("horizontal blinker becomes vertical (returns to original after 2 generations)", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("block remains unchanged", () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("a single cell with no neighbors dies", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Negative coordinates", () => {
    it("handles negative coordinates correctly", () => {
      const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
      expectSameCells(nextGeneration(block), block);
    });

    it("blinker centered at negative coordinates", () => {
      const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
    });
  });

  describe("Infinite grid / sparse representation", () => {
    it("handles far-apart cells without interference", () => {
      // One blinker near origin, another far away
      const cells: Cell[] = [
        [0, 0], [0, 1], [0, 2],
        [1000, 1000], [1000, 1001], [1000, 1002],
      ];
      const next = nextGeneration(cells);
      expectSameCells(next, [
        [-1, 1], [0, 1], [1, 1],
        [999, 1001], [1000, 1001], [1001, 1001],
      ]);
    });

    it("handles very large coordinates", () => {
      const block: Cell[] = [
        [1_000_000, 1_000_000],
        [1_000_001, 1_000_000],
        [1_000_000, 1_000_001],
        [1_000_001, 1_000_001],
      ];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Glider pattern", () => {
    it("glider moves correctly after one generation", () => {
      // Classic glider
      const gen0: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]]);
    });
  });

  describe("Output integrity", () => {
    it("does not mutate the input array", () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const snapshot = JSON.parse(JSON.stringify(input));
      nextGeneration(input);
      expect(input).toEqual(snapshot);
    });

    it("returns each cell only once (no duplicates)", () => {
      const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      const keys = next.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
