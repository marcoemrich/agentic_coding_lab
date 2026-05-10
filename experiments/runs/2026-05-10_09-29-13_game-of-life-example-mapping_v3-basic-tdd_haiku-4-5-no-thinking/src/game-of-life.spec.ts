import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('Rule 1 - Underpopulation', () => {
    it('should kill a live cell with fewer than 2 live neighbors', () => {
      // Gen 0: ##
      //        ..
      // Coordinates: [(0,1), (1,1)] - each has 1 neighbor
      const current = new Set(['0,1', '1,1']);
      const result = nextGeneration(current);
      expect(result.size).toBe(0);
    });

    it('should kill a single isolated cell', () => {
      // Single cell with no neighbors
      const current = new Set(['0,0']);
      const result = nextGeneration(current);
      expect(result.size).toBe(0);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('should keep a live cell with 2 live neighbors', () => {
      // A live cell with exactly 2 neighbors should survive
      const current = new Set(['0,0', '1,0', '0,1']);
      const result = nextGeneration(current);
      expect(result.has('0,0')).toBe(true);
    });

    it('should keep a live cell with 3 live neighbors', () => {
      // Gen 0:  ###
      //         ...
      //         .#.
      // Center cell (1,1) has 3 neighbors and survives
      const current = new Set(['0,1', '1,1', '2,1', '1,3']);
      const result = nextGeneration(current);
      expect(result.has('1,1')).toBe(true);
    });

    it('block pattern stays stable', () => {
      // ##
      // ##
      const current = new Set(['0,0', '1,0', '0,1', '1,1']);
      const result = nextGeneration(current);
      expect(result).toEqual(current);
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('should kill a live cell with more than 3 live neighbors', () => {
      // Gen 0:  ###
      //         .#.
      //         ###
      // Center cell (1,1) has 8 live neighbors and dies
      const current = new Set(['0,0', '1,0', '2,0', '1,1', '0,2', '1,2', '2,2']);
      const result = nextGeneration(current);
      expect(result.has('1,1')).toBe(false);
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('should create a new cell at a dead position with exactly 3 live neighbors', () => {
      // Gen 0:  ##.
      //         #..
      //         ...
      // Dead cell (1,1) has exactly 3 neighbors and becomes alive
      const current = new Set(['0,1', '1,1', '0,2']);
      const result = nextGeneration(current);
      expect(result.has('1,2')).toBe(true);
    });
  });

  describe('Pattern Examples', () => {
    it('blinker oscillator - vertical to horizontal', () => {
      // Gen 0:  .#.
      //         .#.
      //         .#.
      // Coordinates: [(0,0), (0,1), (0,2)]
      const gen0 = new Set(['0,0', '0,1', '0,2']);
      const gen1 = nextGeneration(gen0);

      // Gen 1:  ...
      //         ###
      //         ...
      // Coordinates: [(-1,1), (0,1), (1,1)]
      expect(gen1).toEqual(new Set(['-1,1', '0,1', '1,1']));
    });

    it('blinker oscillator - horizontal to vertical', () => {
      // Gen 0:  ...
      //         ###
      //         ...
      const gen0 = new Set(['-1,1', '0,1', '1,1']);
      const gen1 = nextGeneration(gen0);

      // Gen 1:  .#.
      //         .#.
      //         .#.
      expect(gen1).toEqual(new Set(['0,0', '0,1', '0,2']));
    });

    it('block pattern stays stable', () => {
      // ##
      // ##
      const block = new Set(['0,0', '1,0', '0,1', '1,1']);
      const gen1 = nextGeneration(block);
      expect(gen1).toEqual(block);
    });

    it('empty grid stays empty', () => {
      const empty = new Set<string>();
      const result = nextGeneration(empty);
      expect(result.size).toBe(0);
    });
  });

  describe('Negative Coordinates', () => {
    it('should handle negative x coordinates', () => {
      const current = new Set(['-1,0', '0,0', '1,0']);
      const result = nextGeneration(current);
      expect(result.has('0,-1')).toBe(true);
      expect(result.has('0,1')).toBe(true);
    });

    it('should handle negative y coordinates', () => {
      const current = new Set(['0,-1', '0,0', '0,1']);
      const result = nextGeneration(current);
      expect(result.has('-1,0')).toBe(true);
      expect(result.has('1,0')).toBe(true);
    });

    it('should handle both negative x and y coordinates', () => {
      const current = new Set(['-1,-1', '0,-1', '-1,0']);
      const result = nextGeneration(current);
      // Cell (-1,-1) has 2 live neighbors, so it survives
      expect(result.has('-1,-1')).toBe(true);
    });
  });
});
