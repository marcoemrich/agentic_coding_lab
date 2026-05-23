import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation (live cell with < 2 neighbors dies)", () => {
    it("two adjacent cells [(0,1), (1,1)] each have 1 neighbor, both die → []", () => {
      const result = nextGeneration([[0, 1], [1, 1]]);
      expectSameCells(result, []);
    });

    it("a single isolated cell [(0,0)] has 0 neighbors and dies → []", () => {
      const result = nextGeneration([[0, 0]]);
      expectSameCells(result, []);
    });
  });

  describe("Rule 2: Survival (live cell with 2 or 3 neighbors lives on)", () => {
    it("block corner (0,0) with 3 live neighbors survives", () => {
      // 2x2 block: each cell has 3 live neighbors → all survive
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(cells);
      expect(result).toEqual(expect.arrayContaining([[0, 0]]));
    });

    it("a cell with exactly 2 neighbors survives (blinker middle)", () => {
      // vertical blinker: (0,0),(0,1),(0,2) - middle (0,1) has 2 neighbors
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expect(result).toEqual(expect.arrayContaining([[0, 1]]));
    });
  });

  describe("Rule 3: Overpopulation (live cell with > 3 neighbors dies)", () => {
    it("center (1,1) surrounded by 8 live neighbors but the 3x3 minus one example: center with 4 neighbors dies", () => {
      // Gen 0:  ### / .#. / ### → center (1,1) has 4 neighbors → dies
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(cells);
      // (1,1) must not be in the next generation
      expect(result.find(c => c[0] === 1 && c[1] === 1)).toBeUndefined();
    });

    it("center of a full 3x3 block has 8 neighbors and dies", () => {
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(cells);
      expect(result.find(c => c[0] === 1 && c[1] === 1)).toBeUndefined();
    });
  });

  describe("Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
    it("L-shape: dead cell (1,1) has exactly 3 neighbors → becomes alive", () => {
      // Gen 0: ## . / #.. / ... → (0,0),(1,0),(0,1) ; (1,1) becomes alive
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      // expected gen 1 per the spec example: (0,0),(1,0),(0,1),(1,1) — block forms
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expectSameCells(result, [[-1, 1], [0, 1], [1, 1]]);
    });

    it("horizontal blinker [(-1,1),(0,1),(1,1)] returns to vertical [(0,0),(0,1),(0,2)]", () => {
      const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
      expectSameCells(result, [[0, 0], [0, 1], [0, 2]]);
    });

    it("blinker oscillates: two generations from vertical returns to vertical", () => {
      const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("block [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(cells);
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("[(0,0)] → [] (empty)", () => {
      const result = nextGeneration([[0, 0]]);
      expectSameCells(result, []);
    });
  });

  describe("Empty input", () => {
    it("[] → [] (no cells, nothing to compute)", () => {
      const result = nextGeneration([]);
      expectSameCells(result, []);
    });
  });

  describe("Negative coordinates (infinite grid)", () => {
    it("blinker at large negative coordinates oscillates correctly", () => {
      // vertical blinker centered around (-100, -100)
      const cells: Cell[] = [[-100, -101], [-100, -100], [-100, -99]];
      const result = nextGeneration(cells);
      expectSameCells(result, [[-101, -100], [-100, -100], [-99, -100]]);
    });

    it("cells far from origin (positive and negative) do not interact", () => {
      // isolated cell at (1000, 1000) and isolated cell at (-1000, -1000)
      const result = nextGeneration([[1000, 1000], [-1000, -1000]]);
      expectSameCells(result, []);
    });
  });

  describe("Sparse representation / infinite grid", () => {
    it("a block placed far from origin remains stable", () => {
      const cells: Cell[] = [[500, 500], [501, 500], [500, 501], [501, 501]];
      const result = nextGeneration(cells);
      expectSameCells(result, [[500, 500], [501, 500], [500, 501], [501, 501]]);
    });

    it("reproduction can create cells outside the original bounding box", () => {
      // horizontal blinker → vertical blinker creates cells at y=0 and y=2 (outside original y=1)
      const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
      // expect cells at (0,0) and (0,2) — outside original y range
      expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 2]]));
    });
  });
});
