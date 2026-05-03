import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

describe('Game of Life', () => {
  describe('empty grid', () => {
    it('returns empty set when no living cells', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe('underpopulation rule', () => {
    it('a single living cell dies (zero neighbors)', () => {
      const result = nextGeneration([[0, 0]]);
      expect(result).toEqual([]);
    });

    it('two isolated cells die (one neighbor each)', () => {
      const result = nextGeneration([[0, 0], [1, 0]]);
      expect(result).toEqual([]);
    });
  });

  describe('survival rule', () => {
    it('a living cell with two living neighbors survives', () => {
      // Blinker (vertical) -> Blinker (horizontal)
      // (0,0), (0,1), (0,2) - middle cell has 2 neighbors
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expect(result).toEqual(expect.arrayContaining([[0, 1], [-1, 1], [1, 1]]));
      expect(result).toHaveLength(3);
    });

    it('a living cell with three living neighbors survives (block)', () => {
      // 2x2 block is stable - each cell has 3 neighbors
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(block));
    });
  });

  describe('overpopulation rule', () => {
    it('a living cell with more than three living neighbors dies', () => {
      // Center cell has 4 neighbors
      // (0,0) plus (-1,-1), (1,-1), (-1,1), (1,1)
      const cells: Cell[] = [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
      const result = nextGeneration(cells);
      // center (0,0) has 4 neighbors, dies
      expect(result).not.toContainEqual([0, 0]);
    });
  });

  describe('reproduction rule', () => {
    it('a dead cell with exactly three living neighbors becomes alive', () => {
      // Three cells in L-shape; the (1,1) dead cell has 3 living neighbors
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      expect(result).toEqual(expect.arrayContaining([[1, 1]]));
    });
  });

  describe('blinker pattern', () => {
    it('vertical blinker becomes horizontal', () => {
      const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
      const result = nextGeneration(vertical);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([[-1, 0], [0, 0], [1, 0]]));
    });

    it('horizontal blinker becomes vertical', () => {
      const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
      const result = nextGeneration(horizontal);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([[0, -1], [0, 0], [0, 1]]));
    });
  });

  describe('block pattern (still life)', () => {
    it('block remains the same', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(block));
    });
  });

  describe('negative coordinates', () => {
    it('handles negative coordinates correctly', () => {
      const blinker: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const result = nextGeneration(blinker);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]]));
    });
  });

  describe('infinite grid', () => {
    it('does not lose cells far from origin', () => {
      const block: Cell[] = [[1000000, 1000000], [1000001, 1000000], [1000000, 1000001], [1000001, 1000001]];
      const result = nextGeneration(block);
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(block));
    });
  });

  describe('output uniqueness', () => {
    it('does not produce duplicate cells', () => {
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      const set = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(set.size).toBe(result.length);
    });
  });
});
