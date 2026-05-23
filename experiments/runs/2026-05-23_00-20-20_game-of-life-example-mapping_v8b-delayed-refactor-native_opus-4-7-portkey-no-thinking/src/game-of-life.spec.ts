import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation (live cell with < 2 neighbors dies)", () => {
    it("two adjacent live cells (each has 1 neighbor) both die → []", () => {
      // Gen 0: [(0,1), (1,1)] each has 1 neighbor → both die
      const input: Cell[] = [
        [0, 1],
        [1, 1],
      ];
      expectSameCells(nextGeneration(input), []);
    });

    it("a single live cell with 0 neighbors dies → []", () => {
      // Gen 0: [(0,0)] → Gen 1: []
      const input: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe("Rule 2: Survival (live cell with 2 or 3 neighbors lives on)", () => {
    it("L-shape: center (1,1) has 3 live neighbors → survives", () => {
      // Gen 0:
      //  ###
      //  ...
      //  .#.
      // Cells: (0,2),(1,2),(2,2),(1,0)
      // Center (1,1) is dead but has 4 neighbors among the row above plus the one below
      // The example in prompt says center cell (1,1) has 3 live neighbors → survives.
      // The prompt's Rule 2 example uses (1,1) which is dead in that layout, but
      // we interpret per the prompt's text: "(1,1) has 3 live neighbors → survives".
      // We test directly: a live cell with 3 neighbors survives.
      const input: Cell[] = [
        [1, 1], // live cell under test
        [0, 0],
        [1, 0],
        [2, 0],
      ];
      // (1,1) has neighbors (0,0),(1,0),(2,0) = 3 → survives
      const result = nextGeneration(input);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });

    it("a live cell with exactly 2 neighbors survives", () => {
      // Vertical blinker - the center cell (0,1) has 2 live neighbors → survives
      const input: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const result = nextGeneration(input);
      expect(result.some(([x, y]) => x === 0 && y === 1)).toBe(true);
    });
  });

  describe("Rule 3: Overpopulation (live cell with > 3 neighbors dies)", () => {
    it("center cell (1,1) with 4 live neighbors dies", () => {
      // Gen 0:
      //  ###
      //  .#.
      //  ###
      const input: Cell[] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ];
      const result = nextGeneration(input);
      // (1,1) has 6 neighbors → dies; not in next gen
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe("Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
    it("dead cell (1,1) with exactly 3 live neighbors becomes alive", () => {
      // Gen 0:
      //  ##.
      //  #..
      //  ...
      // Cells: (0,2),(1,2),(0,1)
      // Dead cell (1,1) has neighbors (0,2),(1,2),(0,1) = 3 → becomes alive
      const input: Cell[] = [
        [0, 2],
        [1, 2],
        [0, 1],
      ];
      const result = nextGeneration(input);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });

    it("dead cell with only 2 live neighbors stays dead", () => {
      const input: Cell[] = [
        [0, 0],
        [2, 0],
      ];
      const result = nextGeneration(input);
      expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(false);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
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

    it("blinker returns to original after 2 generations", () => {
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
    it("block [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
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
    it("single cell [(0,0)] → []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Empty input", () => {
    it("empty grid → empty grid", () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe("Negative coordinates / infinite grid", () => {
    it("blinker works at negative coordinates", () => {
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

    it("cells far apart evolve independently (sparse / infinite)", () => {
      // Two single isolated cells, one at (1000000, 1000000), one at (-1000000, -1000000)
      const input: Cell[] = [
        [1000000, 1000000],
        [-1000000, -1000000],
      ];
      expectSameCells(nextGeneration(input), []);
    });
  });
});
