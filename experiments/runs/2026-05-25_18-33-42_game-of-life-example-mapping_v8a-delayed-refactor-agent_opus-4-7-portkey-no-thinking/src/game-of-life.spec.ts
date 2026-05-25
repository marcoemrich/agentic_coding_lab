import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation (live cell with < 2 neighbors dies)', () => {
    it('two horizontally adjacent live cells both die (each has 1 neighbor) → []', () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), []);
    });

    it('a single live cell dies (0 neighbors) → []', () => {
      const gen0: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(gen0), []);
    });
  });

  describe('Rule 2: Survival (live cell with 2 or 3 neighbors lives on)', () => {
    it('live cell with 2 neighbors survives (center of blinker)', () => {
      // Vertical blinker: center (0,1) has 2 live neighbors at (0,0) and (0,2)
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const next = nextGeneration(gen0);
      expect(normalize(next)).toContain('0,1');
    });

    it('live cell with 3 neighbors survives (corner of a 2x2 block)', () => {
      // (0,0) has 3 live neighbors: (1,0), (0,1), (1,1) → survives
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const next = nextGeneration(gen0);
      expect(normalize(next)).toContain('0,0');
    });
  });

  describe('Rule 3: Overpopulation (live cell with > 3 neighbors dies)', () => {
    it('center cell (1,1) with 4 live neighbors dies', () => {
      // Gen 0:    Gen 1:
      // ###       #.#
      // .#.   →   #.#
      // ###       #.#
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
      // Gen 0:    Gen 1:
      // ##.       ##.
      // #..   →   ##.
      // ...       ...
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const next = nextGeneration(gen0);
      expectSameCells(next, [[0, 2], [1, 2], [0, 1], [1, 1]]);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen1);
    });

    it('horizontal blinker [(-1,1),(0,1),(1,1)] → vertical [(0,0),(0,1),(0,2)] (oscillates back)', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), gen2);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('2x2 block [(0,0),(1,0),(0,1),(1,1)] is unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('Pattern: Single cell dies', () => {
    it('[(0,0)] → []', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Empty input', () => {
    it('empty grid stays empty: [] → []', () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe('Negative coordinates', () => {
    it('blinker at negative coordinates oscillates correctly', () => {
      // Vertical blinker at (-10,-10),(-10,-9),(-10,-8) →
      // Horizontal at (-11,-9),(-10,-9),(-9,-9)
      const gen0: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
      const gen1: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
      expectSameCells(nextGeneration(gen0), gen1);
    });

    it('single cell at negative coordinate dies', () => {
      expectSameCells(nextGeneration([[-5, -5]]), []);
    });
  });

  describe('Sparse / infinite grid behavior', () => {
    it('two distant blocks evolve independently and both remain still', () => {
      const cells: Cell[] = [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [100, 100], [101, 100], [100, 101], [101, 101],
      ];
      expectSameCells(nextGeneration(cells), cells);
    });
  });
});
