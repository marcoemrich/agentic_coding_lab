import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation (live cell with < 2 neighbors dies)", () => {
    it("two adjacent cells each having 1 neighbor both die → []", () => {
      const gen0: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("a single isolated cell with 0 neighbors dies → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Rule 2: Survival (live cell with 2 or 3 neighbors lives on)", () => {
    it("a live cell with exactly 2 live neighbors survives (center of a horizontal 3-row)", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [2, 0],
      ];
      const next = nextGeneration(gen0);
      expect(next).toContainEqual([1, 0]);
    });

    it("a live cell with exactly 3 live neighbors survives (corner of a 2x2 block)", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const next = nextGeneration(block);
      expect(next).toContainEqual([0, 0]);
      expect(next).toContainEqual([1, 0]);
      expect(next).toContainEqual([0, 1]);
      expect(next).toContainEqual([1, 1]);
    });
  });

  describe("Rule 3: Overpopulation (live cell with > 3 neighbors dies)", () => {
    it("center cell (1,1) with 4 live neighbors dies", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ];
      const next = nextGeneration(gen0);
      expect(next).not.toContainEqual([1, 1]);
    });
  });

  describe("Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
    it("dead cell (1,1) with 3 live neighbors at (0,0),(1,0),(0,1) becomes alive", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const next = nextGeneration(gen0);
      expect(next).toContainEqual([1, 1]);
    });

    it("rule 4 example: L-shape produces a 2x2 block-like pattern with (1,1) alive", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      expectSameCells(nextGeneration(gen0), [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      expectSameCells(nextGeneration(gen0), [
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    });

    it("horizontal blinker returns to vertical after one generation", () => {
      const gen1: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen1), [
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
    });

    it("blinker after two generations returns to original", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("2x2 block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("[(0,0)] → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Edge cases and infinite grid", () => {
    it("empty input → empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });

    it("handles negative coordinates (blinker at negative origin)", () => {
      const gen0: Cell[] = [
        [-10, -10],
        [-10, -11],
        [-10, -12],
      ];
      expectSameCells(nextGeneration(gen0), [
        [-11, -11],
        [-10, -11],
        [-9, -11],
      ]);
    });

    it("handles very large coordinates (sparse representation)", () => {
      const gen0: Cell[] = [
        [1_000_000, 1_000_000],
        [1_000_001, 1_000_000],
        [1_000_002, 1_000_000],
      ];
      expectSameCells(nextGeneration(gen0), [
        [1_000_001, 999_999],
        [1_000_001, 1_000_000],
        [1_000_001, 1_000_001],
      ]);
    });

    it("two disjoint clusters evolve independently", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const blinker: Cell[] = [
        [100, 100],
        [100, 101],
        [100, 102],
      ];
      const next = nextGeneration([...block, ...blinker]);
      expectSameCells(next, [
        ...block,
        [99, 101],
        [100, 101],
        [101, 101],
      ]);
    });

    it("output contains no duplicate cells", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [2, 0],
      ];
      const next = nextGeneration(gen0);
      const keys = next.map((c) => c.join(","));
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
