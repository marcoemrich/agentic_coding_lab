import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('Empty grid', () => {
    it('should return empty set for empty grid', () => {
      const result = nextGeneration(new Set());
      expect(result).toEqual(new Set());
    });
  });

  describe('Underpopulation', () => {
    it('should kill a living cell with 0 neighbors', () => {
      const alive = new Set(['0,0']);
      const result = nextGeneration(alive);
      expect(result).toEqual(new Set());
    });

    it('should kill a living cell with 1 neighbor', () => {
      const alive = new Set(['0,0', '1,0']);
      const result = nextGeneration(alive);
      expect(result).toEqual(new Set());
    });
  });

  describe('Survival', () => {
    it('should keep a cell alive with 2 neighbors', () => {
      const alive = new Set(['0,0', '0,1', '1,0']);
      const result = nextGeneration(alive);
      expect(result).toContain('0,0');
    });

    it('should keep a cell alive with 3 neighbors', () => {
      const alive = new Set(['0,0', '0,1', '1,0', '1,1']);
      const result = nextGeneration(alive);
      expect(result).toContain('0,0');
    });
  });

  describe('Overpopulation', () => {
    it('should kill a cell with 4 neighbors', () => {
      const alive = new Set([
        '0,-1', '1,-1',
        '0,0', '1,0',
        '0,1'
      ]);
      const result = nextGeneration(alive);
      // 0,0 has neighbors: 0,-1, 1,-1, 1,0, 0,1 = 4 neighbors, so it dies
      expect(result).not.toContain('0,0');
    });

    it('should kill a cell with 5 neighbors', () => {
      const alive = new Set([
        '0,-1', '1,-1', '-1,-1',
        '0,0', '1,0',
        '0,1'
      ]);
      const result = nextGeneration(alive);
      // 0,0 has neighbors: -1,-1, 0,-1, 1,-1, 1,0, 0,1 = 5 neighbors, so it dies
      expect(result).not.toContain('0,0');
    });

    it('should kill a cell with 8 neighbors', () => {
      const alive = new Set([
        '-1,-1', '0,-1', '1,-1',
        '-1,0', '0,0', '1,0',
        '-1,1', '0,1', '1,1'
      ]);
      const result = nextGeneration(alive);
      expect(result).not.toContain('0,0');
    });
  });

  describe('Reproduction', () => {
    it('should create a new cell with exactly 3 neighbors', () => {
      const alive = new Set(['0,0', '1,0', '2,0']);
      const result = nextGeneration(alive);
      expect(result).toContain('1,1');
      expect(result).toContain('1,-1');
    });

    it('should not create a cell with 2 neighbors', () => {
      const alive = new Set(['0,0', '1,0']);
      const result = nextGeneration(alive);
      expect(result.size).toEqual(0);
    });

    it('should not create a cell with 4 neighbors', () => {
      const alive = new Set([
        '0,-1', '0,0', '1,0', '2,0', '3,0'
      ]);
      const result = nextGeneration(alive);
      // Dead cell at (1,-1) has neighbors: (0,-1), (0,0), (1,0), (2,0) = 4 neighbors, so it stays dead
      expect(result).not.toContain('1,-1');
    });
  });

  describe('Negative coordinates', () => {
    it('should handle negative coordinates', () => {
      const alive = new Set(['-1,-1', '0,-1', '1,-1']);
      const result = nextGeneration(alive);
      expect(result).toContain('0,-2');
      expect(result).toContain('0,0');
    });

    it('should handle mixed positive and negative coordinates', () => {
      const alive = new Set(['-1,0', '0,0', '1,0']);
      const result = nextGeneration(alive);
      expect(result).toContain('0,-1');
      expect(result).toContain('0,1');
    });
  });

  describe('Classic patterns', () => {
    it('block should be stable (2x2 square)', () => {
      const alive = new Set(['0,0', '0,1', '1,0', '1,1']);
      const result = nextGeneration(alive);
      expect(result).toEqual(alive);
    });

    it('blinker should oscillate', () => {
      const alive = new Set(['0,0', '1,0', '2,0']);
      const result1 = nextGeneration(alive);
      expect(result1).toEqual(new Set(['1,-1', '1,0', '1,1']));
      const result2 = nextGeneration(result1);
      expect(result2).toEqual(alive);
    });

    it('tub should be stable', () => {
      const alive = new Set(['0,0', '1,-1', '1,1', '2,0']);
      const result = nextGeneration(alive);
      expect(result).toEqual(alive);
    });
  });

  describe('Cell coordinate format', () => {
    it('should use x,y string format for cell coordinates', () => {
      const alive = new Set(['0,0', '1,0', '2,0']);
      const result = nextGeneration(alive);
      expect(Array.from(result).every(cell => typeof cell === 'string')).toBe(true);
      expect(Array.from(result).every(cell => cell.includes(','))).toBe(true);
    });
  });
});
