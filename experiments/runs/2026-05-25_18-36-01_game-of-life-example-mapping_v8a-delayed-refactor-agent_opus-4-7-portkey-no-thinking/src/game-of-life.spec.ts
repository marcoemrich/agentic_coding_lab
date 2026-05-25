import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1 - Underpopulation: live cell with < 2 neighbors dies", () => {
    it("two adjacent live cells (each has 1 neighbor) both die → []", () => {
      const gen0: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("single isolated live cell (0 neighbors) dies → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Rule 2 - Survival: live cell with 2 or 3 neighbors lives on", () => {
    it("live cell with exactly 2 live neighbors survives (block corner)", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const next = nextGeneration(block);
      expect(next).toContainEqual([0, 0]);
    });

    it("live cell with exactly 3 live neighbors survives (center of blinker mid-step)", () => {
      const blinker: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const next = nextGeneration(blinker);
      expect(next).toContainEqual([0, 1]);
    });
  });

  describe("Rule 3 - Overpopulation: live cell with > 3 neighbors dies", () => {
    it("center cell (1,1) with 4 live neighbors dies in next generation", () => {
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

  describe("Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    it("dead cell (1,1) with exactly 3 live neighbors becomes alive", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const next = nextGeneration(gen0);
      expect(next).toContainEqual([1, 1]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const expected: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it("horizontal blinker → vertical (after second generation returns to vertical)", () => {
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
    it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Single cell pattern", () => {
    it("single cell [(0,0)] dies → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Empty input", () => {
    it("empty grid produces empty grid", () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe("Negative coordinates (infinite grid)", () => {
    it("block at negative coordinates remains unchanged", () => {
      const block: Cell[] = [
        [-5, -5],
        [-4, -5],
        [-5, -4],
        [-4, -4],
      ];
      expectSameCells(nextGeneration(block), block);
    });

    it("blinker at negative coordinates oscillates correctly", () => {
      const gen0: Cell[] = [
        [-10, -10],
        [-10, -9],
        [-10, -8],
      ];
      const expected: Cell[] = [
        [-11, -9],
        [-10, -9],
        [-9, -9],
      ];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });

  describe("Sparse representation", () => {
    it("output contains only living cells (no dead cells listed)", () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
      expect(result.length).toBe(4);
    });
  });
});
