import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1 - Underpopulation: live cell with fewer than 2 live neighbors dies", () => {
    it("two adjacent live cells (each with 1 neighbor) both die → expected []", () => {
      const gen0: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("a single live cell with 0 neighbors dies → expected []", () => {
      const gen0: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(gen0), []);
    });
  });

  describe("Rule 2 - Survival: live cell with 2 or 3 live neighbors lives on", () => {
    it("center cell (1,1) with 3 live neighbors survives (spec Rule 2 example)", () => {
      const gen0: Cell[] = [
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 1],
      ];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([1, 1]);
    });

    it("live cell with exactly 2 live neighbors survives (corner of block)", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([0, 0]);
    });
  });

  describe("Rule 3 - Overpopulation: live cell with more than 3 live neighbors dies", () => {
    it("center cell (1,1) with 4 live neighbors (corners + center) dies", () => {
      const gen0: Cell[] = [
        [0, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [2, 2],
      ];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 1]);
    });

    it("center cell of full 3x3 block dies due to 8 neighbors", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive", () => {
    it("dead cell (1,1) with 3 live neighbors becomes alive → expected [(0,0),(1,0),(0,1),(1,1)]", () => {
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
    it("single live cell [(0,0)] → expected []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Empty grid", () => {
    it("empty input → empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe("Infinite grid / negative coordinates", () => {
    it("handles negative coordinates correctly (blinker at negative origin)", () => {
      const gen0: Cell[] = [
        [-10, -10],
        [-10, -9],
        [-10, -8],
      ];
      expectSameCells(nextGeneration(gen0), [
        [-11, -9],
        [-10, -9],
        [-9, -9],
      ]);
    });

    it("a new cell can be born outside the bounding box of input live cells", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([1, 1]);
    });
  });

  describe("Output shape", () => {
    it("returns an array of [x, y] tuples", () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
      for (const cell of result) {
        expect(Array.isArray(cell)).toBe(true);
        expect(cell).toHaveLength(2);
        expect(typeof cell[0]).toBe("number");
        expect(typeof cell[1]).toBe("number");
      }
    });

    it("does not contain duplicate cells", () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
      const seen = new Set<string>();
      for (const [x, y] of result) {
        const k = `${x},${y}`;
        expect(seen.has(k)).toBe(false);
        seen.add(k);
      }
    });
  });
});
