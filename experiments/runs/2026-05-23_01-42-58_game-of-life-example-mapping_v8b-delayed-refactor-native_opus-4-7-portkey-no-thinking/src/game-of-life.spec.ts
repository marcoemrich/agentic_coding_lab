import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation - live cell with < 2 neighbors dies", () => {
    it("two adjacent cells (each with 1 neighbor) both die → []", () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("single live cell with 0 neighbors dies → []", () => {
      const gen0: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(gen0), []);
    });
  });

  describe("Rule 2: Survival - live cell with 2 or 3 neighbors lives on", () => {
    it("live cell with exactly 2 neighbors survives (blinker center (0,1))", () => {
      // Vertical blinker: center (0,1) has 2 neighbors
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([0, 1]);
    });

    it("live cell with exactly 3 neighbors survives (corner of block)", () => {
      // Block: (0,0) is alive with 3 live neighbors (1,0),(0,1),(1,1) → survives
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([0, 0]);
    });
  });

  describe("Rule 3: Overpopulation - live cell with > 3 neighbors dies", () => {
    it("center cell (1,1) of filled 3x3 ring with 4 neighbors dies", () => {
      // Gen 0:
      //  ###
      //  .#.
      //  ###
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(gen0);
      // center (1,1) had 6 neighbors → dies
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Rule 4: Reproduction - dead cell with exactly 3 neighbors becomes alive", () => {
    it("dead cell (1,1) with exactly 3 live neighbors becomes alive", () => {
      // Gen 0:
      //  ##.
      //  #..
      //  ...
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([1, 1]);
    });

    it("dead cell with only 2 neighbors does NOT become alive", () => {
      const gen0: Cell[] = [[0, 0], [2, 0]];
      const result = nextGeneration(gen0);
      // (1,0) has 2 neighbors, must not be born
      expect(result).not.toContainEqual([1, 0]);
    });

    it("dead cell with 4 neighbors does NOT become alive", () => {
      // four corners around (1,1)
      const gen0: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0), (0,1), (0,2)] → horizontal [(-1,1), (0,1), (1,1)]", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1Expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it("horizontal blinker → vertical blinker (gen 2 returns to original)", () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2Expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), gen2Expected);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("block [(0,0), (1,0), (0,1), (1,1)] remains unchanged", () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen0);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("single cell [(0,0)] → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Edge cases & constraints", () => {
    it("empty input returns empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });

    it("handles negative coordinates correctly (blinker at negative origin)", () => {
      // Vertical blinker centered at (-10, -10)
      const gen0: Cell[] = [[-10, -11], [-10, -10], [-10, -9]];
      const gen1Expected: Cell[] = [[-11, -10], [-10, -10], [-9, -10]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it("handles cells far apart on the infinite grid independently", () => {
      // Two distant blinkers — each evolves independently
      const blinkerA: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const blinkerB: Cell[] = [[1000, 1000], [1000, 1001], [1000, 1002]];
      const gen0: Cell[] = [...blinkerA, ...blinkerB];
      const expected: Cell[] = [
        [-1, 1], [0, 1], [1, 1],
        [999, 1001], [1000, 1001], [1001, 1001],
      ];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it("Gen 0 underpopulation example [(0,1), (1,1)] → []", () => {
      // Repeated from spec to mirror exact coordinates given
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe("Glider (additional sanity pattern)", () => {
    it("classic glider advances by 1 step into expected configuration", () => {
      // Standard glider — included to confirm full rule integration.
      // Initial:
      //  .#.
      //  ..#
      //  ###
      const gen0: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      // After 1 generation (well-known glider step):
      //  ...
      //  #.#
      //  .##
      //  .#.
      const gen1Expected: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });
  });
});
