import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('basic rules', () => {
    it('empty grid stays empty', () => {
      const cells = new Set<string>();
      expect(nextGeneration(cells)).toEqual(new Set());
    });

    it('single cell dies (underpopulation)', () => {
      const cells = new Set(['0,0']);
      expect(nextGeneration(cells)).toEqual(new Set());
    });

    it('cell with one neighbor dies (underpopulation)', () => {
      const cells = new Set(['0,0', '1,0']);
      expect(nextGeneration(cells)).toEqual(new Set());
    });

    it('cell with two neighbors survives', () => {
      const cells = new Set(['0,0', '1,0', '2,0']);
      const result = nextGeneration(cells);
      expect(result.has('1,0')).toBe(true);
    });

    it('cell with three neighbors survives', () => {
      const cells = new Set(['0,0', '1,0', '1,1', '0,1']);
      const result = nextGeneration(cells);
      expect(result.has('0,0')).toBe(true);
    });

    it('cell with four neighbors dies (overpopulation)', () => {
      const cells = new Set(['0,0', '1,0', '0,1', '1,1', '2,0']);
      const result = nextGeneration(cells);
      expect(result.has('1,0')).toBe(false);
    });

    it('dead cell with exactly three neighbors becomes alive', () => {
      const cells = new Set(['0,0', '1,0', '0,1']);
      const result = nextGeneration(cells);
      expect(result.has('1,1')).toBe(true);
    });

    it('dead cell with two neighbors stays dead', () => {
      const cells = new Set(['0,0', '1,0']);
      const result = nextGeneration(cells);
      expect(result.has('0,1')).toBe(false);
    });

    it('dead cell with four neighbors stays dead', () => {
      // (1,1) has 4 neighbors: (0,0), (1,0), (0,1), (2,1)
      const cells = new Set(['0,0', '1,0', '0,1', '2,1']);
      const result = nextGeneration(cells);
      expect(result.has('1,1')).toBe(false);
    });
  });

  describe('negative coordinates', () => {
    it('handles negative x coordinates', () => {
      const cells = new Set(['-1,0', '0,0', '1,0']);
      const result = nextGeneration(cells);
      expect(result.has('0,0')).toBe(true);
    });

    it('handles negative y coordinates', () => {
      const cells = new Set(['0,-1', '0,0', '0,1']);
      const result = nextGeneration(cells);
      expect(result.has('0,0')).toBe(true);
    });

    it('handles negative x and y coordinates', () => {
      const cells = new Set(['-1,-1', '0,-1', '-1,0', '0,0']);
      const result = nextGeneration(cells);
      expect(result.has('-1,-1')).toBe(true);
    });
  });

  describe('known patterns', () => {
    it('block pattern stays stable', () => {
      // 2x2 block is stable
      const cells = new Set(['0,0', '1,0', '0,1', '1,1']);
      const result = nextGeneration(cells);
      expect(result).toEqual(cells);
    });

    it('blinker oscillates (horizontal to vertical)', () => {
      // Horizontal blinker
      const cells = new Set(['0,1', '1,1', '2,1']);
      const result = nextGeneration(cells);
      // Should become vertical
      expect(result).toEqual(new Set(['1,0', '1,1', '1,2']));
    });

    it('blinker oscillates (vertical to horizontal)', () => {
      // Vertical blinker
      const cells = new Set(['1,0', '1,1', '1,2']);
      const result = nextGeneration(cells);
      // Should become horizontal
      expect(result).toEqual(new Set(['0,1', '1,1', '2,1']));
    });
  });

  describe('sparse representation', () => {
    it('only returns living cells', () => {
      const cells = new Set(['0,0', '1,0', '2,0']);
      const result = nextGeneration(cells);
      // Result should only contain strings (coordinate pairs)
      expect(result instanceof Set).toBe(true);
      for (const cell of result) {
        expect(typeof cell).toBe('string');
        const parts = cell.split(',');
        expect(parts.length).toBe(2);
        expect(!isNaN(Number(parts[0]))).toBe(true);
        expect(!isNaN(Number(parts[1]))).toBe(true);
      }
    });
  });
});
