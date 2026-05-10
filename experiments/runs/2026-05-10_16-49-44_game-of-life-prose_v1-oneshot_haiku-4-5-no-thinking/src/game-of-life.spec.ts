import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('basic rules', () => {
    it('empty grid stays empty', () => {
      const result = nextGeneration(new Set());
      expect(result).toEqual(new Set());
    });

    it('single cell dies from underpopulation', () => {
      const result = nextGeneration(new Set(['0,0']));
      expect(result).toEqual(new Set());
    });

    it('two cells die (both have only 1 neighbor)', () => {
      const result = nextGeneration(new Set(['0,0', '1,0']));
      expect(result).toEqual(new Set());
    });

    it('cell with exactly 3 neighbors is born', () => {
      // Pattern: three cells in a line (0,0), (1,0), (2,0)
      // Dead cell (1,1) has exactly 3 neighbors
      const result = nextGeneration(new Set(['0,0', '1,0', '2,0']));
      expect(result).toContain('1,1');
      expect(result).toContain('1,-1');
    });

    it('cell with 2 or 3 neighbors survives', () => {
      // Blinker: three cells in a row
      // Middle cell has 2 neighbors, should survive
      const result = nextGeneration(new Set(['0,0', '1,0', '2,0']));
      // The middle cell (1,0) survives
      expect(result).toContain('1,0');
    });

    it('cell with more than 3 neighbors dies', () => {
      // Five cells in a + pattern around (0,0)
      const result = nextGeneration(
        new Set(['0,0', '1,0', '-1,0', '0,1', '0,-1'])
      );
      // Center (0,0) has 4 neighbors, should die
      expect(result).not.toContain('0,0');
    });
  });

  describe('coordinate system', () => {
    it('handles negative coordinates', () => {
      const result = nextGeneration(new Set(['-1,-1', '0,-1', '1,-1']));
      expect(result.size).toBeGreaterThan(0);
    });

    it('handles mixed positive and negative coordinates', () => {
      const result = nextGeneration(
        new Set(['0,0', '-1,0', '1,0', '0,-1', '0,1'])
      );
      expect(result).toBeDefined();
    });
  });

  describe('patterns', () => {
    it('blinker alternates between horizontal and vertical', () => {
      // Horizontal blinker
      const gen1 = new Set(['0,0', '1,0', '2,0']);
      const gen2 = nextGeneration(gen1);

      // Should become vertical
      expect(gen2).toEqual(new Set(['1,-1', '1,0', '1,1']));

      // Next generation should be horizontal again
      const gen3 = nextGeneration(gen2);
      expect(gen3).toEqual(gen1);
    });

    it('block is stable', () => {
      // 2x2 square
      const block = new Set(['0,0', '1,0', '0,1', '1,1']);
      const result = nextGeneration(block);
      expect(result).toEqual(block);
    });

    it('tub is stable', () => {
      // Tub pattern:
      //  .#.
      //  #.#
      //  .#.
      const tub = new Set(['1,0', '0,1', '2,1', '1,2']);
      const result = nextGeneration(tub);
      expect(result).toEqual(tub);
    });
  });

  describe('return type', () => {
    it('returns a Set<string> with coordinates in "x,y" format', () => {
      const result = nextGeneration(new Set(['0,0', '1,0', '2,0']));
      expect(result instanceof Set).toBe(true);
      for (const coord of result) {
        expect(typeof coord).toBe('string');
        expect(coord).toMatch(/^-?\d+,-?\d+$/);
      }
    });
  });
});
