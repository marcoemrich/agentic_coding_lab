import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation", () => {
    it("kills a live cell with fewer than 2 live neighbors", () => {
      // Two adjacent cells, each has 1 neighbor → both die
      const result = nextGeneration([
        [0, 1],
        [1, 1],
      ]);
      expectSameCells(result, []);
    });

    it("kills a single live cell with 0 neighbors", () => {
      const result = nextGeneration([[0, 0]]);
      expectSameCells(result, []);
    });
  });

  describe("Rule 2: Survival", () => {
    it("keeps a live cell with 2 live neighbors alive", () => {
      // Blinker - center cell has 2 neighbors and survives
      const result = nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      // Becomes horizontal blinker
      expectSameCells(result, [
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    });

    it("keeps a live cell with 3 live neighbors alive", () => {
      // Block - each corner has 3 neighbors → unchanged
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(block);
      expectSameCells(result, block);
    });
  });

  describe("Rule 3: Overpopulation", () => {
    it("kills a live cell with more than 3 live neighbors", () => {
      // Plus-shape configuration where center has 4 neighbors
      // From prompt example: ###/.#./### with center (1,1)
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
      // The center (1,1) had 4 neighbors → dies
      const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(resultSet.has("1,1")).toBe(false);
    });
  });

  describe("Rule 4: Reproduction", () => {
    it("brings a dead cell with exactly 3 live neighbors to life", () => {
      // From prompt example: ##./#../...  -> (1,1) is dead with 3 neighbors
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]);
      // Becomes a block: (0,0), (1,0), (0,1), (1,1)
      expectSameCells(result, [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
    });

    it("does not bring a dead cell with 2 neighbors to life", () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
      ]);
      // (0,1) and (1,1) each have 2 neighbors but stay dead
      // Both live cells die from underpopulation
      expectSameCells(result, []);
    });

    it("does not bring a dead cell with 4 neighbors to life", () => {
      // 4 cells around (1,1): (0,0), (2,0), (0,2), (2,2)
      const result = nextGeneration([
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ]);
      const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(resultSet.has("1,1")).toBe(false);
    });
  });

  describe("Patterns", () => {
    it("oscillates a vertical blinker into a horizontal blinker", () => {
      const result = nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      expectSameCells(result, [
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    });

    it("oscillates a horizontal blinker back into vertical", () => {
      const result = nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
      expectSameCells(result, [
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
    });

    it("keeps a block unchanged (still life)", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(block);
      expectSameCells(result, block);
    });

    it("kills a single cell", () => {
      const result = nextGeneration([[0, 0]]);
      expectSameCells(result, []);
    });
  });

  describe("Edge cases", () => {
    it("returns empty array for empty input", () => {
      expect(nextGeneration([])).toEqual([]);
    });

    it("handles negative coordinates", () => {
      // Vertical blinker at negative coordinates
      const result = nextGeneration([
        [-5, -5],
        [-5, -4],
        [-5, -3],
      ]);
      expectSameCells(result, [
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ]);
    });

    it("handles cells far apart", () => {
      // Two isolated cells far apart → both die
      const result = nextGeneration([
        [-1000, -1000],
        [1000, 1000],
      ]);
      expectSameCells(result, []);
    });

    it("does not return duplicate cells", () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
      const keys = result.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
