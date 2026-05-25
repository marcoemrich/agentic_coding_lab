import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function normalize(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation - live cell with fewer than 2 neighbors dies", () => {
    it("two adjacent live cells (each with 1 neighbor) both die — expected []", () => {
      const gen0: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("a single live cell with 0 neighbors dies — expected []", () => {
      const gen0: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(gen0), []);
    });
  });

  describe("Rule 2: Survival - live cell with 2 or 3 neighbors lives on", () => {
    it("a block — each cell has exactly 3 live neighbors — all 4 survive", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), gen0);
    });

    it("middle cell of a row of three has 2 neighbors and survives", () => {
      // Horizontal triple: (0,0),(1,0),(2,0). Middle (1,0) has 2 live neighbors → survives.
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [2, 0],
      ];
      const result = nextGeneration(gen0);
      expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
    });
  });

  describe("Rule 3: Overpopulation - live cell with more than 3 neighbors dies", () => {
    it("center cell (1,1) in 3x3 fully-live except missing center example dies", () => {
      // Gen 0:
      //  ###
      //  .#.
      //  ###
      const gen0: Cell[] = [
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 1],
        [0, 0],
        [1, 0],
        [2, 0],
      ];
      const result = nextGeneration(gen0);
      // Center (1,1) had 6 live neighbors → dies
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });

    it("center of a 3x3 solid block (9 live cells) has 8 neighbors and dies", () => {
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
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe("Rule 4: Reproduction - dead cell with exactly 3 neighbors becomes alive", () => {
    it("L-shape spec example: dead cell (1,1) has 3 neighbors → becomes alive", () => {
      // Gen 0:
      //  ##.
      //  #..
      //  ...
      // Gen 1:
      //  ##.
      //  ##.
      //  ...
      const gen0: Cell[] = [
        [0, 2],
        [1, 2],
        [0, 1],
      ];
      const expected: Cell[] = [
        [0, 2],
        [1, 2],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const expectedGen1: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(gen0), expectedGen1);
    });

    it("horizontal blinker returns to vertical (period 2)", () => {
      const gen1: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      const expectedGen2: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      expectSameCells(nextGeneration(gen1), expectedGen2);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("a 2x2 block remains unchanged — expected [(0,0),(1,0),(0,1),(1,1)]", () => {
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
    it("a single cell [(0,0)] yields empty next generation", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Edge cases", () => {
    it("empty input yields empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });

    it("handles negative coordinates — blinker centered at negative coords", () => {
      const gen0: Cell[] = [
        [-5, -5],
        [-5, -4],
        [-5, -3],
      ];
      const expectedGen1: Cell[] = [
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ];
      expectSameCells(nextGeneration(gen0), expectedGen1);
    });

    it("handles cells far apart — both isolated cells die", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1000, 1000],
      ];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("output contains no duplicate cells", () => {
      const gen0: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(gen0);
      const keys = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(keys.size).toBe(result.length);
    });
  });
});
