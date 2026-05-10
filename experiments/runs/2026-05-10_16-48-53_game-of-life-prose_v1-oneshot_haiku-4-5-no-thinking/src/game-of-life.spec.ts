import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('empty grid', () => {
    it('should return empty set for empty grid', () => {
      const result = nextGeneration(new Set());
      expect(result).toEqual(new Set());
    });
  });

  describe('single cell', () => {
    it('should kill a single cell (underpopulation)', () => {
      const result = nextGeneration(new Set(['0,0']));
      expect(result).toEqual(new Set());
    });
  });

  describe('underpopulation', () => {
    it('should kill cells with fewer than 2 live neighbors', () => {
      // One cell at (0,0) with one neighbor at (1,0)
      const cells = new Set(['0,0', '1,0']);
      const result = nextGeneration(cells);
      expect(result).toEqual(new Set());
    });
  });

  describe('survival', () => {
    it('should keep a cell alive with 2 live neighbors', () => {
      // Cell at (0,0) with neighbors at (0,1) and (1,0)
      const cells = new Set(['0,0', '0,1', '1,0']);
      const result = nextGeneration(cells);
      expect(result).toContain('0,0');
    });

    it('should keep a cell alive with 3 live neighbors', () => {
      // Cell at (0,0) with neighbors at (0,1), (1,0), and (1,1)
      const cells = new Set(['0,0', '0,1', '1,0', '1,1']);
      const result = nextGeneration(cells);
      expect(result).toContain('0,0');
    });
  });

  describe('overpopulation', () => {
    it('should kill a cell with more than 3 live neighbors', () => {
      // Cell at (0,0) with 4 neighbors
      const cells = new Set(['0,0', '0,1', '1,0', '1,1', '-1,0']);
      const result = nextGeneration(cells);
      expect(result).not.toContain('0,0');
    });
  });

  describe('reproduction', () => {
    it('should resurrect a dead cell with exactly 3 live neighbors', () => {
      // Dead cell at (0,0) with live neighbors at (1,0), (1,1), (0,1)
      const cells = new Set(['1,0', '1,1', '0,1']);
      const result = nextGeneration(cells);
      expect(result).toContain('0,0');
    });
  });

  describe('negative coordinates', () => {
    it('should handle negative coordinates', () => {
      const cells = new Set(['-1,-1', '-1,0', '0,-1']);
      const result = nextGeneration(cells);
      expect(result).toContain('-1,-1');
    });
  });

  describe('block pattern (still life)', () => {
    it('should keep a 2x2 block unchanged', () => {
      // Classic still life pattern
      const cells = new Set(['0,0', '0,1', '1,0', '1,1']);
      const result = nextGeneration(cells);
      expect(result).toEqual(new Set(['0,0', '0,1', '1,0', '1,1']));
    });
  });

  describe('blinker pattern (oscillator)', () => {
    it('should oscillate a blinker pattern', () => {
      // Blinker in horizontal position
      const cells = new Set(['0,0', '1,0', '2,0']);
      const result = nextGeneration(cells);
      // Should become vertical
      expect(result).toEqual(new Set(['1,-1', '1,0', '1,1']));
    });
  });

  describe('glider pattern', () => {
    it('should move a glider pattern correctly', () => {
      // Classic glider pattern
      const cells = new Set(['0,1', '1,2', '2,0', '2,1', '2,2']);
      const result = nextGeneration(cells);
      // Glider moves down-right (verified output)
      expect(result).toEqual(new Set(['1,0', '1,2', '2,1', '2,2', '3,1']));
    });
  });
});
