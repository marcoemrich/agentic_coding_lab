import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation (live cell with fewer than 2 neighbors dies)", () => {
    it("two adjacent live cells each with 1 neighbor both die → []", () => {
      const input: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(input), []);
    });

    it("a single isolated cell with 0 neighbors dies → []", () => {
      const input: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe("Rule 2: Survival (live cell with 2 or 3 neighbors lives on)", () => {
    it("center cell (1,1) with 3 live neighbors in row+below survives", () => {
      // Gen 0:  ###     row y=2
      //         ...     row y=1
      //         .#.     row y=0
      // Live cells: (0,2),(1,2),(2,2),(1,0)
      // Center (1,1) is dead but has 4 neighbors above + (1,0) below — let's pick the spec example exactly.
      // The spec describes:
      // Gen 0:       Gen 1:
      //  ###          .#.
      //  ...    →     .#.
      //  .#.          ...
      // Coordinates interpretation: top row y=2, middle y=1, bottom y=0.
      // Gen 0 cells: (0,2),(1,2),(2,2),(1,0)
      // Center (1,1) has 4 live neighbors → reproduction does NOT apply (needs exactly 3).
      // The "survival" example in the spec is illustrative.
      // For a clean Rule 2 test, use the blinker middle: (1,1) with neighbors (0,1) and (2,1) → 2 neighbors → survives.
      const input: Cell[] = [
        [0, 1],
        [1, 1],
        [2, 1],
      ];
      const result = nextGeneration(input);
      // (1,1) has 2 neighbors → survives
      expect(result).toContainEqual([1, 1]);
    });

    it("live cell with exactly 3 neighbors survives", () => {
      // Block corner: (0,0) has 3 live neighbors (1,0),(0,1),(1,1) → survives
      const input: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(input);
      expect(result).toContainEqual([0, 0]);
    });
  });

  describe("Rule 3: Overpopulation (live cell with more than 3 neighbors dies)", () => {
    it("center cell (1,1) with 4 live neighbors dies", () => {
      // Gen 0:
      //  ###     y=2
      //  .#.     y=1
      //  ###     y=0
      // Center (1,1) has neighbors at (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) → 6 → dies
      const input: Cell[] = [
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 1],
        [0, 0],
        [1, 0],
        [2, 0],
      ];
      const result = nextGeneration(input);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
    it("dead cell (1,1) with exactly 3 live neighbors becomes alive", () => {
      // Gen 0:
      //  ##.     y=2
      //  #..     y=1
      //  ...     y=0
      // Live: (0,2),(1,2),(0,1). Dead (1,1) has 3 neighbors → born.
      const input: Cell[] = [
        [0, 2],
        [1, 2],
        [0, 1],
      ];
      const result = nextGeneration(input);
      expect(result).toContainEqual([1, 1]);
    });

    it("dead cell with only 2 neighbors does NOT become alive", () => {
      const input: Cell[] = [
        [0, 0],
        [2, 0],
      ];
      const result = nextGeneration(input);
      expect(result).not.toContainEqual([1, 0]);
    });

    it("dead cell with 4 neighbors does NOT become alive", () => {
      const input: Cell[] = [
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ];
      const result = nextGeneration(input);
      // (1,1) has 4 neighbors → not born
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const gen1Expected: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it("horizontal blinker returns to vertical after one generation", () => {
      const gen1: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      const gen2Expected: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      expectSameCells(nextGeneration(gen1), gen2Expected);
    });

    it("blinker oscillates with period 2 (gen 0 == gen 2)", () => {
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
    it("block [(0,0),(1,0),(0,1),(1,1)] is unchanged after one generation", () => {
      const block: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Pattern: Single cell", () => {
    it("single live cell [(0,0)] dies → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Edge cases", () => {
    it("empty input returns empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });

    it("handles negative coordinates correctly", () => {
      // Blinker shifted to negative coords
      const gen0: Cell[] = [
        [-5, -5],
        [-5, -4],
        [-5, -3],
      ];
      const gen1Expected: Cell[] = [
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it("handles cells far from origin (large coordinates)", () => {
      const block: Cell[] = [
        [1000, 1000],
        [1001, 1000],
        [1000, 1001],
        [1001, 1001],
      ];
      expectSameCells(nextGeneration(block), block);
    });

    it("two disjoint patterns evolve independently", () => {
      // Blinker near origin + block far away
      const input: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
        [100, 100],
        [101, 100],
        [100, 101],
        [101, 101],
      ];
      const expected: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
        [100, 100],
        [101, 100],
        [100, 101],
        [101, 101],
      ];
      expectSameCells(nextGeneration(input), expected);
    });
  });

  describe("API contract", () => {
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

    it("returns cells as [x, y] tuples", () => {
      const result = nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      for (const cell of result) {
        expect(Array.isArray(cell)).toBe(true);
        expect(cell).toHaveLength(2);
        expect(typeof cell[0]).toBe("number");
        expect(typeof cell[1]).toBe("number");
      }
    });
  });
});
