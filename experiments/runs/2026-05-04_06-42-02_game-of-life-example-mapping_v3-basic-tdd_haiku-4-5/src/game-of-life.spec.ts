import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('Rule 1: Underpopulation (live cell with < 2 neighbors dies)', () => {
    it('should kill a cell with 0 neighbors', () => {
      const input = [[0, 0]];
      const result = nextGeneration(input);
      expect(result).toEqual([]);
    });

    it('should kill a cell with 1 neighbor', () => {
      const input = [[0, 1], [1, 1]];
      const result = nextGeneration(input);
      expect(result).toEqual([]);
    });
  });

  describe('Rule 2: Survival (live cell with 2 or 3 neighbors lives on)', () => {
    it('should keep a cell with 2 live neighbors', () => {
      const input = [[0, 0], [1, 0], [2, 0]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('1,0')).toBe(true);
      expect(resultSet.has('1,-1')).toBe(true);
      expect(resultSet.has('1,1')).toBe(true);
    });

    it('should keep a cell with 3 live neighbors', () => {
      const input = [[0, 0], [1, 0], [2, 0], [1, -1]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('1,0')).toBe(true);
    });
  });

  describe('Rule 3: Overpopulation (live cell with > 3 neighbors dies)', () => {
    it('should kill a cell with 4 neighbors', () => {
      const input = [[0, 0], [1, 0], [2, 0], [1, -1], [1, 1]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('1,0')).toBe(false);
    });

    it('should kill a cell with 8 neighbors', () => {
      const input = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2]
      ];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('1,1')).toBe(false);
    });
  });

  describe('Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)', () => {
    it('should create a live cell with exactly 3 neighbors', () => {
      const input = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('1,1')).toBe(true);
    });

    it('should not create a live cell with 2 neighbors', () => {
      const input = [[0, 0], [1, 0]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('0,1')).toBe(false);
      expect(resultSet.has('1,1')).toBe(false);
    });

    it('should not create a live cell with 4 neighbors', () => {
      const input = [[0, 0], [1, 0], [2, 0], [1, 1]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('1,2')).toBe(false);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('should transform vertical line to horizontal line', () => {
      const input = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      expect(result.length).toBe(3);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('-1,1')).toBe(true);
      expect(resultSet.has('0,1')).toBe(true);
      expect(resultSet.has('1,1')).toBe(true);
    });

    it('should transform back to vertical line', () => {
      const input = [[-1, 1], [0, 1], [1, 1]];
      const result = nextGeneration(input);
      expect(result.length).toBe(3);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('0,0')).toBe(true);
      expect(resultSet.has('0,1')).toBe(true);
      expect(resultSet.has('0,2')).toBe(true);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('should remain unchanged', () => {
      const input = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(input);
      expect(result.length).toBe(4);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      expect(resultSet.has('0,0')).toBe(true);
      expect(resultSet.has('1,0')).toBe(true);
      expect(resultSet.has('0,1')).toBe(true);
      expect(resultSet.has('1,1')).toBe(true);
    });
  });

  describe('Pattern: Single cell dies', () => {
    it('should produce empty grid', () => {
      const input = [[0, 0]];
      const result = nextGeneration(input);
      expect(result).toEqual([]);
    });
  });

  describe('Negative coordinates', () => {
    it('should handle cells with negative x coordinates', () => {
      const input = [[0, -1], [0, 0], [0, 1]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      // Vertical line becomes horizontal line with negative x coordinate
      expect(resultSet.has('-1,0')).toBe(true);
      expect(resultSet.has('0,0')).toBe(true);
      expect(resultSet.has('1,0')).toBe(true);
    });

    it('should handle cells with negative y coordinates', () => {
      const input = [[-1, 0], [0, 0], [1, 0]];
      const result = nextGeneration(input);
      const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
      // Horizontal line becomes vertical line with negative y coordinate
      expect(resultSet.has('0,-1')).toBe(true);
      expect(resultSet.has('0,0')).toBe(true);
      expect(resultSet.has('0,1')).toBe(true);
    });
  });

  describe('Empty grid', () => {
    it('should produce empty grid from empty input', () => {
      const input: [number, number][] = [];
      const result = nextGeneration(input);
      expect(result).toEqual([]);
    });
  });
});
