import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life";

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("Game of Life", () => {
  describe("Rule 1 – Underpopulation: live cell with < 2 neighbors dies", () => {
    it("single live cell dies", () => {
      const gen0: Cell[] = [[0, 0]];
      expect(nextGeneration(gen0)).toEqual([]);
    });

    it("two live cells each with 1 neighbor both die", () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expect(nextGeneration(gen0)).toEqual([]);
    });
  });

  describe("Rule 2 – Survival: live cell with 2 or 3 neighbors lives on", () => {
    it("live cell with 2 neighbors survives", () => {
      // Block: (0,0),(1,0),(0,1),(1,1) - center cells each have 3 neighbors
      // Use blinker: center cell has 2 neighbors
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      // (0,1) has 2 neighbors → survives (actually blinker center has 2 neighbors)
      expect(gen1.some(([x, y]) => x === 0 && y === 1)).toBe(true);
    });

    it("block is stable (still life) - each cell has 3 neighbors", () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const gen1 = nextGeneration(gen0);
      expect(sortCells(gen1)).toEqual(sortCells(gen0));
    });
  });

  describe("Rule 3 – Overpopulation: live cell with > 3 neighbors dies", () => {
    it("live cell with 4 neighbors dies", () => {
      // Center cell surrounded by 4 live cells
      const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
      const gen1 = nextGeneration(gen0);
      // Center (1,1) has neighbors: (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) → 6 neighbors → dies
      expect(gen1.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe("Rule 4 – Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    it("dead cell with 3 neighbors becomes alive", () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const gen1 = nextGeneration(gen0);
      // (1,1) is dead but has 3 live neighbors → becomes alive
      expect(gen1.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });
  });

  describe("Pattern examples", () => {
    it("blinker oscillates: vertical → horizontal → vertical", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expect(sortCells(gen1)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));

      const gen2 = nextGeneration(gen1);
      expect(sortCells(gen2)).toEqual(sortCells([[0, 0], [0, 1], [0, 2]]));
    });

    it("block is a still life", () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen0));
    });

    it("empty grid stays empty", () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe("Infinite grid - handles negative coordinates", () => {
    it("works with negative coordinates", () => {
      const gen0: Cell[] = [[-1, -1], [0, -1], [-1, 0]];
      const gen1 = nextGeneration(gen0);
      // (0,0) is dead with 3 live neighbors → becomes alive
      expect(gen1.some(([x, y]) => x === 0 && y === 0)).toBe(true);
    });
  });
});
