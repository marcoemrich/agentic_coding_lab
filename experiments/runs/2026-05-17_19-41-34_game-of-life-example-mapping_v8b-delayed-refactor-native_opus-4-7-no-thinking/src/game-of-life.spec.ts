import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration", () => {
  describe("empty input", () => {
    it("returns empty array for empty input", () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe("Rule 1: Underpopulation (live cell with fewer than 2 neighbors dies)", () => {
    it("a single live cell dies with 0 neighbors", () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });

    it("two adjacent live cells both die (each has 1 neighbor)", () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it("two diagonal live cells both die (each has 1 neighbor)", () => {
      expectSameCells(nextGeneration([[0, 0], [1, 1]]), []);
    });
  });

  describe("Rule 2: Survival (live cell with 2 or 3 neighbors lives)", () => {
    it("center cell of an L-shape with 2 neighbors survives", () => {
      // (0,0), (1,0), (1,1) — (1,0) has 2 neighbors
      const result = nextGeneration([[0, 0], [1, 0], [1, 1]]);
      expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
    });

    it("center cell with 3 neighbors survives", () => {
      // T-shape: (0,1), (1,1), (2,1), (1,0) — (1,1) has 3 neighbors
      const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 0]]);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });
  });

  describe("Rule 3: Overpopulation (live cell with more than 3 neighbors dies)", () => {
    it("center cell of a filled 3x3 dies (has 8 neighbors)", () => {
      const cells: Cell[] = [];
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          cells.push([x, y]);
        }
      }
      const result = nextGeneration(cells);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });

    it("center of a plus-with-extra (4 neighbors) dies", () => {
      // (1,1) surrounded by 4 cells: (0,1), (2,1), (1,0), (1,2)
      const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe("Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
    it("dead cell (1,1) with 3 live neighbors becomes alive", () => {
      // (0,0), (1,0), (0,1) — (1,1) has 3 neighbors
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });

    it("dead cell with 2 live neighbors does not become alive", () => {
      // (0,0), (1,0) — (1,1) has 2 neighbors
      const result = nextGeneration([[0, 0], [1, 0]]);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });

    it("dead cell with 4 live neighbors does not become alive", () => {
      // (0,0), (2,0), (0,2), (2,2) — (1,1) has 4 neighbors
      const result = nextGeneration([[0, 0], [2, 0], [0, 2], [2, 2]]);
      expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe("Patterns", () => {
    it("blinker oscillates: vertical → horizontal", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
    });

    it("blinker oscillates: horizontal → vertical", () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it("blinker returns to original after 2 generations", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });

    it("block is a still life (unchanged)", () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });

    it("single cell dies", () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });

    it("L-tromino evolves to a block", () => {
      // (0,0), (1,0), (0,1) → block (0,0),(1,0),(0,1),(1,1)
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe("Infinite grid / negative coordinates", () => {
    it("handles negative coordinates", () => {
      const cells: Cell[] = [[-10, -10], [-10, -9], [-10, -11]];
      const result = nextGeneration(cells);
      expectSameCells(result, [[-11, -10], [-10, -10], [-9, -10]]);
    });

    it("handles cells far apart independently", () => {
      // Two separate blinkers
      const blinker1: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const blinker2: Cell[] = [[100, 100], [100, 101], [100, 102]];
      const result = nextGeneration([...blinker1, ...blinker2]);
      expectSameCells(result, [
        [-1, 1], [0, 1], [1, 1],
        [99, 101], [100, 101], [101, 101],
      ]);
    });

    it("handles cells crossing the origin", () => {
      // Block straddling origin
      const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Output properties", () => {
    it("does not produce duplicate cells", () => {
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]]; // block
      const result = nextGeneration(cells);
      const keys = result.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it("does not mutate input array", () => {
      const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const snapshot = JSON.parse(JSON.stringify(cells));
      nextGeneration(cells);
      expect(cells).toEqual(snapshot);
    });
  });
});
