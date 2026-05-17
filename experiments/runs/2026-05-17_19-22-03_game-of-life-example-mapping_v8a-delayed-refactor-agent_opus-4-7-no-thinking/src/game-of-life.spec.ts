import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Empty grid", () => {
    it("returns empty when given an empty input", () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe("Rule 1: Underpopulation", () => {
    it("a single live cell with 0 neighbors dies", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it("two adjacent live cells each with 1 neighbor both die", () => {
      // From the prompt: cells (0,1) and (1,1), each has 1 neighbor
      const input: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      // Both die from underpopulation. No dead cell has 3 neighbors.
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe("Rule 2: Survival", () => {
    it("a live cell with 2 live neighbors survives", () => {
      // Blinker vertical: (0,0), (0,1), (0,2). Middle (0,1) has 2 neighbors → survives
      const input: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const result = nextGeneration(input);
      // Survivors: (0,1). New births: (-1,1), (1,1). So horizontal blinker.
      expectSameCells(result, [
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    });

    it("a live cell with 3 live neighbors survives", () => {
      // Block: 2x2, each cell has exactly 3 neighbors → all survive
      const input: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(input), [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
    });
  });

  describe("Rule 3: Overpopulation", () => {
    it("a live cell with more than 3 live neighbors dies", () => {
      // From prompt: pattern with center (1,1) having 4 neighbors
      // Grid (column x, row y) - rows from prompt top→bottom:
      // ### row 0
      // .#. row 1
      // ### row 2
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(input);
      // Center (1,1) had 4 neighbors → dies. Verify (1,1) is not in result.
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe("Rule 4: Reproduction", () => {
    it("a dead cell with exactly 3 live neighbors becomes alive", () => {
      // From prompt:
      // ##.
      // #..
      // ...
      // Cells: (0,0),(1,0),(0,1) → dead cell (1,1) has exactly 3 live neighbors
      const input: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const result = nextGeneration(input);
      expectSameCells(result, [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
    });

    it("a dead cell with 2 live neighbors stays dead", () => {
      // Three cells in an L shape that produces no births in some empty cells
      const input: Cell[] = [
        [0, 0],
        [0, 1],
      ];
      // Both die (each has 1 neighbor). No dead cell has 3 neighbors.
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe("Pattern: Blinker oscillator", () => {
    it("vertical blinker becomes horizontal blinker", () => {
      const input: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      expectSameCells(nextGeneration(input), [
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    });

    it("blinker oscillates back to original after 2 generations", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const gen1 = nextGeneration(gen0);
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("block remains unchanged", () => {
      const input: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(input), input);
    });
  });

  describe("Single cell", () => {
    it("a single cell dies", () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });
  });

  describe("Infinite grid - negative coordinates", () => {
    it("handles negative coordinates", () => {
      const input: Cell[] = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
      ];
      expectSameCells(nextGeneration(input), [
        [-2, 0],
        [-1, 0],
        [0, 0],
      ]);
    });

    it("block placed at far negative coordinates remains still", () => {
      const input: Cell[] = [
        [-1000, -1000],
        [-999, -1000],
        [-1000, -999],
        [-999, -999],
      ];
      expectSameCells(nextGeneration(input), input);
    });
  });

  describe("Input independence", () => {
    it("does not mutate the input array", () => {
      const input: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const snapshot = JSON.parse(JSON.stringify(input));
      nextGeneration(input);
      expect(input).toEqual(snapshot);
    });

    it("handles duplicate cells in input as a single cell", () => {
      // Even if a caller passes duplicates, behavior should match the
      // de-duplicated set (since we model 'living cells' as a set).
      const withDuplicates: Cell[] = [
        [0, 0],
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const withoutDuplicates: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      expectSameCells(
        nextGeneration(withDuplicates),
        nextGeneration(withoutDuplicates),
      );
    });
  });
});
