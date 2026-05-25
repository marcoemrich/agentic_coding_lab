import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation - live cell with < 2 neighbors dies", () => {
    it("two adjacent cells (each has 1 neighbor) → both die, result is []", () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("a single isolated cell dies (0 neighbors) → result is []", () => {
      const gen0: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(gen0), []);
    });
  });

  describe("Rule 2: Survival - live cell with 2 or 3 neighbors lives on", () => {
    it("live cell with exactly 2 live neighbors survives (block corner)", () => {
      // 2x2 block - each cell has exactly 3 live neighbors, all survive
      // To isolate the 2-neighbor case, use L-shape: (0,0),(1,0),(0,1)
      // (0,0) has 2 live neighbors: (1,0),(0,1) → survives
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const next = nextGeneration(gen0);
      expect(next).toContainEqual([0, 0]);
    });

    it("live cell with exactly 3 live neighbors survives (block)", () => {
      // 2x2 block - each cell has exactly 3 live neighbors → all survive
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const next = nextGeneration(gen0);
      expect(next).toContainEqual([0, 0]);
      expect(next).toContainEqual([1, 0]);
      expect(next).toContainEqual([0, 1]);
      expect(next).toContainEqual([1, 1]);
    });
  });

  describe("Rule 3: Overpopulation - live cell with > 3 neighbors dies", () => {
    it("center cell (1,1) with > 3 live neighbors dies in next gen", () => {
      // Gen 0:
      //  ###    (0,0)(1,0)(2,0)
      //  .#.    (1,1)
      //  ###    (0,2)(1,2)(2,2)
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const next = nextGeneration(gen0);
      // Center (1,1) had 6 live neighbors → dies (overpopulation)
      expect(next).not.toContainEqual([1, 1]);
    });
  });

  describe("Rule 4: Reproduction - dead cell with exactly 3 live neighbors becomes alive", () => {
    it("dead cell (1,1) with 3 live neighbors becomes alive", () => {
      // Gen 0:
      //  ##.    (0,0)(1,0)
      //  #..    (0,1)
      //  ...
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const next = nextGeneration(gen0);
      // Expected Gen 1:
      //  ##.    (0,0)(1,0)
      //  ##.    (0,1)(1,1)
      expectSameCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
    });

    it("blinker oscillates back: gen2 equals gen0", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("2x2 block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen0);
    });
  });

  describe("Single cell dies", () => {
    it("[(0,0)] → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Empty input", () => {
    it("[] → []", () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe("Negative coordinates", () => {
    it("blinker centered at origin in negative space oscillates correctly", () => {
      // Vertical blinker at x=-5: (-5,-1),(-5,0),(-5,1)
      const gen0: Cell[] = [[-5, -1], [-5, 0], [-5, 1]];
      const gen1 = nextGeneration(gen0);
      // Becomes horizontal at y=0: (-6,0),(-5,0),(-4,0)
      expectSameCells(gen1, [[-6, 0], [-5, 0], [-4, 0]]);
    });

    it("reproduction works around negative coordinates", () => {
      // Same shape as rule 4 example, translated to negative space
      const gen0: Cell[] = [[-2, -2], [-1, -2], [-2, -1]];
      const next = nextGeneration(gen0);
      expectSameCells(next, [[-2, -2], [-1, -2], [-2, -1], [-1, -1]]);
    });
  });

  describe("Infinite grid behavior", () => {
    it("cells far apart with no interaction each follow rules independently", () => {
      // Two separate blocks far apart - both still lifes
      const gen0: Cell[] = [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [1000, 1000], [1001, 1000], [1000, 1001], [1001, 1001],
      ];
      expectSameCells(nextGeneration(gen0), gen0);
    });
  });
});
