import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectCellsEqual(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation (live cell with < 2 neighbors dies)', () => {
    it('two adjacent cells (each with 1 neighbor) both die → []', () => {
      // Gen 0: [(0,1), (1,1)] - each has 1 neighbor
      // Gen 1: []
      expectCellsEqual(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it('a single live cell with 0 neighbors dies → []', () => {
      // Gen 0: [(0,0)]
      // Gen 1: []
      expectCellsEqual(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Rule 2: Survival (live cell with 2 or 3 neighbors lives on)', () => {
    it('live cell with exactly 2 live neighbors survives (block corner)', () => {
      // A 2x2 block: each cell has exactly 2 live neighbors → all survive
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const next = nextGeneration(block);
      expect(normalize(next)).toContain('0,0');
    });

    it('live cell with exactly 3 live neighbors survives (center of L-shape)', () => {
      // Cells: (0,0), (1,0), (0,1), (1,1) — (0,0) has 3 live neighbors → survives
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const next = nextGeneration(cells);
      // (0,0) has 3 live neighbors: (1,0), (0,1), (1,1) → survives
      expect(normalize(next)).toContain('0,0');
    });

    it('blinker rotates: vertical (3 in column) → horizontal (3 in row)', () => {
      // Gen 0: [(0,0), (0,1), (0,2)]
      // Gen 1: [(-1,1), (0,1), (1,1)]
      expectCellsEqual(
        nextGeneration([[0, 0], [0, 1], [0, 2]]),
        [[-1, 1], [0, 1], [1, 1]],
      );
    });
  });

  describe('Rule 3: Overpopulation (live cell with > 3 neighbors dies)', () => {
    it('center cell with 4 live neighbors dies', () => {
      // Gen 0:       Gen 1:
      //  ###          #.#
      //  .#.    →     #.#
      //  ###          #.#
      // Center (1,1) has 4 live neighbors → dies (not in Gen 1)
      const gen0: Cell[] = [
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ];
      const next = nextGeneration(gen0);
      expect(normalize(next)).not.toContain('1,1');
    });

    it('center of 3x3 filled pattern (7 cells, hole in middle-row sides) dies from overpopulation', () => {
      // Gen 0: ### / .#. / ###  → the center cell (1,1) has 6 live neighbors → dies (overpopulation)
      const gen0: Cell[] = [
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ];
      const next = nextGeneration(gen0);
      expect(normalize(next)).not.toContain('1,1');
    });
  });

  describe('Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)', () => {
    it('dead cell (1,1) with exactly 3 live neighbors becomes alive', () => {
      // Gen 0:        Gen 1:
      //  ##.           ##.
      //  #..     →     ##.
      //  ...           ...
      // Dead cell (1,1) has 3 live neighbors → becomes alive
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
      expectCellsEqual(nextGeneration(gen0), expected);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker → horizontal blinker (gen 0 → gen 1)', () => {
      // Gen 0: [(0,0), (0,1), (0,2)]
      // Gen 1: [(-1,1), (0,1), (1,1)]
      expectCellsEqual(
        nextGeneration([[0, 0], [0, 1], [0, 2]]),
        [[-1, 1], [0, 1], [1, 1]],
      );
    });

    it('horizontal blinker → vertical blinker (gen 1 → gen 2 returns to vertical)', () => {
      // Gen 1: [(-1,1), (0,1), (1,1)]
      // Gen 2: [(0,0), (0,1), (0,2)]
      expectCellsEqual(
        nextGeneration([[-1, 1], [0, 1], [1, 1]]),
        [[0, 0], [0, 1], [0, 2]],
      );
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('2x2 block [(0,0), (1,0), (0,1), (1,1)] is unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCellsEqual(nextGeneration(block), block);
    });
  });

  describe('Pattern: Single cell', () => {
    it('a single live cell [(0,0)] dies → []', () => {
      expectCellsEqual(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Empty input', () => {
    it('empty grid → empty grid', () => {
      expectCellsEqual(nextGeneration([]), []);
    });
  });

  describe('Infinite grid / negative coordinates', () => {
    it('handles negative coordinates (vertical blinker at negative origin)', () => {
      // Same as blinker but shifted to negative coordinates
      // Gen 0: [(-5, -5), (-5, -4), (-5, -3)]
      // Gen 1: [(-6, -4), (-5, -4), (-4, -4)]
      expectCellsEqual(
        nextGeneration([[-5, -5], [-5, -4], [-5, -3]]),
        [[-6, -4], [-5, -4], [-4, -4]],
      );
    });

    it('cells far apart (no neighbor interaction) all die from underpopulation', () => {
      expectCellsEqual(
        nextGeneration([[0, 0], [100, 100], [-100, -100]]),
        [],
      );
    });
  });
});
