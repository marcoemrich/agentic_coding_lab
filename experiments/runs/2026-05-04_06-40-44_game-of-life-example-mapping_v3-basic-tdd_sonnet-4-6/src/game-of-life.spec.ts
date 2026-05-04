import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('Game of Life', () => {
  describe('Rule 1 - Underpopulation', () => {
    it('a live cell with 0 neighbors dies', () => {
      const gen0: Cell[] = [[0, 0]];
      expect(nextGeneration(gen0)).toEqual([]);
    });

    it('a live cell with 1 neighbor dies', () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expect(nextGeneration(gen0)).toEqual([]);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('a live cell with 2 neighbors survives', () => {
      // Blinker middle cell has 2 neighbors
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expect(gen1.some(([x, y]) => x === 0 && y === 1)).toBe(true);
    });

    it('a live cell with 3 neighbors survives', () => {
      // Block: all cells have 3 neighbors and survive
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen0));
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('a live cell with more than 3 neighbors dies', () => {
      // Center cell surrounded by 4+ live cells dies
      const gen0: Cell[] = [[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]];
      const gen1 = nextGeneration(gen0);
      expect(gen1.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('a dead cell with exactly 3 neighbors becomes alive', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const gen1 = nextGeneration(gen0);
      expect(gen1.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });
  });

  describe('Pattern examples', () => {
    it('Blinker oscillates (gen 0 → gen 1)', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expect(sortCells(gen1)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
    });

    it('Blinker oscillates (gen 1 → gen 2)', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2 = nextGeneration(gen1);
      expect(sortCells(gen2)).toEqual(sortCells([[0, 0], [0, 1], [0, 2]]));
    });

    it('Block is a still life', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen0));
    });

    it('Single cell dies', () => {
      const gen0: Cell[] = [[0, 0]];
      expect(nextGeneration(gen0)).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('empty grid stays empty', () => {
      expect(nextGeneration([])).toEqual([]);
    });

    it('handles negative coordinates', () => {
      const gen0: Cell[] = [[-1, -1], [0, -1], [-1, 0]];
      const gen1 = nextGeneration(gen0);
      expect(gen1.some(([x, y]) => x === 0 && y === 0)).toBe(true);
    });
  });
});
