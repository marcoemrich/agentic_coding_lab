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
  describe("Rule 1 - Underpopulation: live cell with < 2 neighbors dies", () => {
    it("two adjacent live cells (each with 1 neighbor) both die: [(0,1),(1,1)] -> []", () => {
      const result = nextGeneration([
        [0, 1],
        [1, 1],
      ]);
      expectSameCells(result, []);
    });

    it("single live cell with 0 neighbors dies: [(0,0)] -> []", () => {
      const result = nextGeneration([[0, 0]]);
      expectSameCells(result, []);
    });
  });

  describe("Rule 2 - Survival: live cell with 2 or 3 neighbors lives on", () => {
    it("live cell with 2 live neighbors survives (block corner: (0,0) has neighbors (1,0),(0,1))", () => {
      // Block pattern - each corner has exactly 2 live neighbors
      const input: Cell[] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain("0,0");
    });

    it("live cell with 3 live neighbors survives (center of blinker)", () => {
      // Vertical blinker: center (0,1) has 2 live neighbors (0,0) and (0,2)
      // Use a configuration where center has 3 neighbors.
      // L-shape: (0,0),(1,0),(0,1),(2,1) — cell (1,1) is dead.
      // Use (1,1) live with neighbors (0,0),(2,0),(1,2) → 3 neighbors
      const input: Cell[] = [
        [0, 0],
        [2, 0],
        [1, 1],
        [1, 2],
      ];
      const result = nextGeneration(input);
      // (1,1) has neighbors (0,0)L,(2,0)L,(1,2)L → 3 → survives
      expect(normalize(result)).toContain("1,1");
    });
  });

  describe("Rule 3 - Overpopulation: live cell with > 3 neighbors dies", () => {
    it("center cell (1,1) with 4 live neighbors dies", () => {
      // Gen 0:
      //  ###
      //  .#.
      //  ###
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
      expect(normalize(result)).not.toContain("1,1");
    });

    it("Rule 3 example - center dies, corners survive; reproduction at top/bottom extends pattern", () => {
      // Gen 0:
      //  ###
      //  .#.
      //  ###
      // Within 3x3 window Gen 1 shows: #.# / #.# / #.#
      // Plus reproduction at (1,-1) and (1,3) since each has 3 live neighbors.
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
      expectSameCells(result, [
        [0, 2],
        [2, 2],
        [1, 2],
        [0, 0],
        [2, 0],
        [1, 0],
        [1, -1],
        [1, 3],
      ]);
    });
  });

  describe("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive", () => {
    it("dead cell (1,1) with 3 neighbors comes alive", () => {
      // Gen 0:
      //  ##.
      //  #..
      //  ...
      const input: Cell[] = [
        [0, 2],
        [1, 2],
        [0, 1],
      ];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain("1,1");
    });

    it("Rule 4 full gen 1 = [(0,2),(1,2),(0,1),(1,1)]", () => {
      // Gen 0:
      //  ##.
      //  #..
      //  ...
      // Gen 1:
      //  ##.
      //  ##.
      //  ...
      const input: Cell[] = [
        [0, 2],
        [1, 2],
        [0, 1],
      ];
      const result = nextGeneration(input);
      expectSameCells(result, [
        [0, 2],
        [1, 2],
        [0, 1],
        [1, 1],
      ]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
      ];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
    });

    it("horizontal blinker oscillates back to vertical", () => {
      const gen1: Cell[] = [
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, [
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
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
      const result = nextGeneration(block);
      expectSameCells(result, block);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("[(0,0)] -> []", () => {
      const result = nextGeneration([[0, 0]]);
      expectSameCells(result, []);
    });
  });

  describe("Edge cases", () => {
    it("empty input returns empty output", () => {
      const result = nextGeneration([]);
      expectSameCells(result, []);
    });

    it("handles negative coordinates (blinker at negative origin)", () => {
      const gen0: Cell[] = [
        [-10, -10],
        [-10, -9],
        [-10, -8],
      ];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [
        [-11, -9],
        [-10, -9],
        [-9, -9],
      ]);
    });

    it("handles large coordinates (sparse representation)", () => {
      const gen0: Cell[] = [
        [1000000, 0],
        [1000000, 1],
        [1000000, 2],
      ];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [
        [999999, 1],
        [1000000, 1],
        [1000001, 1],
      ]);
    });

    it("two distant blinkers evolve independently", () => {
      const gen0: Cell[] = [
        [0, 0],
        [0, 1],
        [0, 2],
        [100, 100],
        [100, 101],
        [100, 102],
      ];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [
        [-1, 1],
        [0, 1],
        [1, 1],
        [99, 101],
        [100, 101],
        [101, 101],
      ]);
    });
  });
});
