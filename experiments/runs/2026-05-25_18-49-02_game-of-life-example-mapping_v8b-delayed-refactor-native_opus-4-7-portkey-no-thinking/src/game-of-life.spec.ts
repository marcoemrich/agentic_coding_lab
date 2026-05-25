import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.ts";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("Game of Life - nextGeneration", () => {
  describe("Rule 1: Underpopulation (live cell with < 2 neighbors dies)", () => {
    it("two adjacent live cells both die (each has 1 neighbor): [(0,1),(1,1)] -> []", () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it("a single live cell dies (0 neighbors): [(0,0)] -> []", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Rule 2: Survival (live cell with 2 or 3 neighbors lives on)", () => {
    it("live cell with exactly 2 live neighbors survives (middle of horizontal triple)", () => {
      // (0,0),(1,0),(2,0): middle (1,0) is alive with neighbors (0,0) and (2,0) -> 2 neighbors -> survives.
      const gen0: Cell[] = [[0, 0], [1, 0], [2, 0]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([1, 0]);
    });

    it("live cell with exactly 3 live neighbors survives (corner of 2x2 block)", () => {
      // (0,0) in the block has neighbors (1,0),(0,1),(1,1) = 3 -> survives.
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expect(result).toContainEqual([0, 0]);
    });
  });

  describe("Rule 3: Overpopulation (live cell with > 3 neighbors dies)", () => {
    it("center cell (1,1) with 4 live neighbors dies", () => {
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)", () => {
    it("dead cell (1,1) with exactly 3 live neighbors becomes alive: [(0,2),(1,2),(0,1)] -> includes (1,1)", () => {
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const result = nextGeneration(gen0);
      expect(result).toContainEqual([1, 1]);
    });

    it("dead cell with only 2 neighbors does NOT become alive", () => {
      const gen0: Cell[] = [[0, 0], [2, 0]];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 0]);
    });

    it("dead cell with 4 neighbors does NOT become alive", () => {
      const gen0: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];
      const result = nextGeneration(gen0);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it("horizontal blinker [(-1,1),(0,1),(1,1)] -> vertical [(0,0),(0,1),(0,2)]", () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), expected);
    });

    it("blinker returns to original state after 2 generations", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("2x2 block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Pattern: Single cell dies", () => {
    it("[(0,0)] -> [] (single cell with 0 neighbors dies)", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe("Edge cases", () => {
    it("empty input returns empty output", () => {
      expectSameCells(nextGeneration([]), []);
    });

    it("handles negative coordinates (blinker centered at negative origin)", () => {
      const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it("handles cells very far apart (sparse / infinite grid)", () => {
      const gen0: Cell[] = [[0, 0], [1000000, 1000000]];
      expectSameCells(nextGeneration(gen0), []);
    });

    it("two separate blocks stay as two separate blocks", () => {
      const gen0: Cell[] = [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [10, 10], [11, 10], [10, 11], [11, 11],
      ];
      expectSameCells(nextGeneration(gen0), gen0);
    });
  });

  describe("Reproduction rule example from spec", () => {
    it("L-shape [(0,1),(1,1),(0,2)] -> square [(0,1),(1,1),(0,2),(1,2)]", () => {
      // From spec: Gen0 = ##. / #.. / ... in (col, row from top) notation
      // Top row y=2: (0,2),(1,2); middle row y=1: (0,1); becomes a 2x2 block.
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });
});
