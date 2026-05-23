import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1 - Underpopulation: live cell with fewer than 2 neighbors dies', () => {
    it('two adjacent cells (each with 1 neighbor) both die → []', () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, []);
    });

    it('a single isolated cell (0 neighbors) dies → []', () => {
      const gen0: Cell[] = [[0, 0]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, []);
    });
  });

  describe('Rule 2 - Survival: live cell with 2 or 3 neighbors lives on', () => {
    it('center cell of a row of 3 with a cell below survives (3 neighbors)', () => {
      // ###
      // ...
      // .#.
      // center (1,1) has 3 neighbors (the row above + nothing) — actually verify per spec
      // From spec: top row ###, middle ..., bottom .#. → cell (1,2) has neighbors (0,2),(2,2) and (1,0)? Let's use coords from spec image:
      // Row y=2: (0,2),(1,2),(2,2)
      // Row y=0: (1,0)
      const gen0: Cell[] = [[0, 2], [1, 2], [2, 2], [1, 0]];
      const gen1 = nextGeneration(gen0);
      // (1,2) should survive (it has neighbors (0,2),(2,2) = 2 neighbors → survives)
      expect(normalize(gen1)).toContain('1,2');
    });

    it('blinker vertical → horizontal: middle cell survives across generations', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      // middle (0,1) has 2 neighbors → survives
      expect(normalize(gen1)).toContain('0,1');
    });
  });

  describe('Rule 3 - Overpopulation: live cell with more than 3 neighbors dies', () => {
    it('center cell of pattern ###/.#./### dies (has 4 live neighbors)', () => {
      // Per spec Rule 3:
      // Gen 0: ###      Gen 1 (3x3 window): #.#
      //        .#.   →                      #.#
      //        ###                          #.#
      // The center (1,1) dies. The 4 corners survive (each has 3 neighbors).
      // (Spec depicts only the 3x3 window; on the infinite grid additional
      //  births also occur outside that window.)
      const gen0: Cell[] = [
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ];
      const gen1 = nextGeneration(gen0);
      const keys = normalize(gen1);
      // Center dies
      expect(keys).not.toContain('1,1');
      // 4 corners survive
      expect(keys).toContain('0,0');
      expect(keys).toContain('2,0');
      expect(keys).toContain('0,2');
      expect(keys).toContain('2,2');
    });
  });

  describe('Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    it('L-shaped 3 cells: dead cell with exactly 3 neighbors comes alive', () => {
      // Gen 0: ##. / #.. / ...
      // Cells: (0,2),(1,2),(0,1)
      // Dead cell (1,1) has 3 live neighbors → becomes alive
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const gen1 = nextGeneration(gen0);
      // Expected per spec: ##. / ##. / ...
      const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
      expectSameCells(gen1, expected);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(gen1, expected);
    });

    it('blinker oscillates back: horizontal → vertical after one more generation', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2 = nextGeneration(gen1);
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(gen2, expected);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('2x2 block [(0,0),(1,0),(0,1),(1,1)] remains unchanged', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, gen0);
    });
  });

  describe('Pattern: Single cell dies', () => {
    it('a single live cell [(0,0)] dies → []', () => {
      const gen0: Cell[] = [[0, 0]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, []);
    });
  });

  describe('Edge cases', () => {
    it('empty input → empty output', () => {
      expectSameCells(nextGeneration([]), []);
    });

    it('handles negative coordinates (blinker centered at origin works with negatives)', () => {
      // vertical blinker at x=-5
      const gen0: Cell[] = [[-5, -1], [-5, 0], [-5, 1]];
      const gen1 = nextGeneration(gen0);
      const expected: Cell[] = [[-6, 0], [-5, 0], [-4, 0]];
      expectSameCells(gen1, expected);
    });

    it('handles large/infinite-grid coordinates', () => {
      const gen0: Cell[] = [[1000000, 1000000], [1000001, 1000000], [1000000, 1000001], [1000001, 1000001]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, gen0);
    });

    it('does not produce duplicate cells', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      const keys = normalize(gen1);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
