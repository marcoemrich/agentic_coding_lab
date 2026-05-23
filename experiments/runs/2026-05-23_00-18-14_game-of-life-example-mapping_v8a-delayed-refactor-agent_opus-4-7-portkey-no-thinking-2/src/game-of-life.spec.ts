import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1 - Underpopulation: live cell with fewer than 2 neighbors dies", () => {
    it("two adjacent live cells (each has 1 neighbor) both die → []", () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("a single isolated live cell (0 neighbors) dies → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Rule 2 - Survival: live cell with 2 or 3 neighbors lives on", () => {
    it("live cell with exactly 2 neighbors survives (corner of a block)", () => {
      // A 2x2 block: every cell has exactly 3 live neighbors
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expect(result).toContainEqual([0, 0]);
    });

    it("middle of a 3-in-a-row (blinker) - the center cell has 2 neighbors and survives", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([0, 1]);
    });
  });

  describe("Rule 3 - Overpopulation: live cell with more than 3 neighbors dies", () => {
    it("center cell (1,1) with 4 live neighbors dies", () => {
      // Gen 0:
      //  ###
      //  .#.
      //  ###
      const gen0: Cell[] = [
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 1]);
    });

    it("Rule 3 setup: corners (0,0),(2,0),(0,2),(2,2) each have 2 neighbors and survive", () => {
      const gen0: Cell[] = [
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([0, 0]);
      expect(result).toContainEqual([2, 0]);
      expect(result).toContainEqual([0, 2]);
      expect(result).toContainEqual([2, 2]);
    });
  });

  describe("Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    it("dead cell (1,1) with exactly 3 live neighbors becomes alive", () => {
      // Gen 0:
      //  ##.  (y=2)
      //  #..  (y=1)
      //  ...  (y=0)
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([1, 1]);
    });

    it("Rule 4 example - full expected next generation is ##. / ##. / ...", () => {
      // Gen 1 expected: ## . / ## . / . . .
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0), (0,1), (0,2)] → horizontal [(-1,1), (0,1), (1,1)]", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it("horizontal blinker returns to vertical after one generation", () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), expected);
    });

    it("blinker oscillates: gen0 → gen1 → gen2 equals gen0", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("block [(0,0), (1,0), (0,1), (1,1)] is unchanged", () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("single cell [(0,0)] → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Empty input", () => {
    it("empty input → empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe("Infinite grid / negative coordinates", () => {
    it("handles negative coordinates - blinker centered at large negative coords", () => {
      const gen0: Cell[] = [[-100, -100], [-100, -99], [-100, -98]];
      const expected: Cell[] = [[-101, -99], [-100, -99], [-99, -99]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it("handles mixed-sign coordinates - block at origin spanning negative and positive", () => {
      const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
      expectSameCells(nextGeneration(block), block);
    });
  });
});
