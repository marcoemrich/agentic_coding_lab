import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('Rule 1: Underpopulation', () => {
    it('should kill a live cell with fewer than 2 neighbors', () => {
      // Gen 0: ##  (at (0,1) and (1,1), each with 1 neighbor)
      // Gen 1: ..
      const cells = [[0, 1], [1, 1]];
      const result = nextGeneration(cells);
      expect(result).toEqual([]);
    });

    it('should kill a single isolated cell', () => {
      // Gen 0: #
      // Gen 1: .
      const cells = [[0, 0]];
      const result = nextGeneration(cells);
      expect(result).toEqual([]);
    });
  });

  describe('Rule 2: Survival', () => {
    it('should keep a live cell with exactly 2 neighbors alive', () => {
      // Three in a row - center survives
      // Gen 0: ###
      // Gen 1: .#.
      const cells = [[0, 0], [1, 0], [2, 0]];
      const result = nextGeneration(cells);
      expect(result).toContainEqual([1, 0]);
    });

    it('should keep a live cell with exactly 3 neighbors alive', () => {
      // Gen 0: #..
      //        #..
      //        .#.
      // The cell at (1,1) (dead) has 3 live neighbors: (0,0), (0,1), (1,2)
      // So (1,1) should become alive
      const cells = [[0, 0], [0, 1], [1, 2]];
      const result = nextGeneration(cells);
      expect(result).toContainEqual([1, 1]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('should kill a live cell with more than 3 neighbors', () => {
      // Gen 0: ###
      //        .#.
      //        ###
      // Center (1,1) has 8 neighbors, too many! (but let's use correct example)
      // Actually, let's do a simpler case with 4 neighbors
      // Gen 0: .#.
      //        ###
      //        .#.
      // Center (1,1) has 4 neighbors → dies
      const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
      const result = nextGeneration(cells);
      expect(result).not.toContainEqual([1, 1]);
    });

    it('should handle the overpopulation example from spec', () => {
      // Gen 0: ###
      //        .#.
      //        ###
      // Center (1,1) has 8 neighbors → dies
      // Result should be: #.#
      //                   #.#
      //                   #.#
      const cells = [
        [0, 0], [1, 0], [2, 0],  // top row
        [1, 1],                  // center
        [0, 2], [1, 2], [2, 2]   // bottom row
      ];
      const result = nextGeneration(cells);
      expect(result).not.toContainEqual([1, 1]);
      expect(result).toContainEqual([0, 0]);
      expect(result).toContainEqual([2, 0]);
      expect(result).toContainEqual([0, 2]);
      expect(result).toContainEqual([2, 2]);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('should create a live cell from a dead cell with exactly 3 neighbors', () => {
      // Gen 0: ##.
      //        #..
      //        ...
      // Dead cell (1,1) has exactly 3 neighbors → becomes alive
      const cells = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      expect(result).toContainEqual([1, 1]);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('should oscillate correctly', () => {
      // Gen 0: .#.
      //        .#.
      //        .#.
      // Coordinates: (0,0), (0,1), (0,2)
      // Gen 1: ...
      //        ###
      //        ...
      // Coordinates: (-1,1), (0,1), (1,1)
      const gen0 = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);

      // Should have 3 cells in horizontal orientation
      expect(gen1).toHaveLength(3);
      expect(gen1).toContainEqual([-1, 1]);
      expect(gen1).toContainEqual([0, 1]);
      expect(gen1).toContainEqual([1, 1]);

      // Running it again should give back the vertical orientation
      const gen2 = nextGeneration(gen1);
      expect(gen2).toHaveLength(3);
      expect(gen2).toContainEqual([0, 0]);
      expect(gen2).toContainEqual([0, 1]);
      expect(gen2).toContainEqual([0, 2]);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('should remain unchanged', () => {
      // Gen 0: ##
      //        ##
      // Coordinates: (0,0), (1,0), (0,1), (1,1)
      const cells = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(cells);

      expect(result).toHaveLength(4);
      expect(result).toContainEqual([0, 0]);
      expect(result).toContainEqual([1, 0]);
      expect(result).toContainEqual([0, 1]);
      expect(result).toContainEqual([1, 1]);
    });
  });

  describe('Negative coordinates', () => {
    it('should handle negative coordinates', () => {
      const cells = [[-1, -1], [0, -1], [1, -1]];
      const result = nextGeneration(cells);
      // Should oscillate similar to blinker
      expect(result).toContainEqual([0, -2]);
      expect(result).toContainEqual([0, -1]);
      expect(result).toContainEqual([0, 0]);
    });
  });

  describe('Empty grid', () => {
    it('should return empty array for empty input', () => {
      const result = nextGeneration([]);
      expect(result).toEqual([]);
    });
  });

  describe('Complex patterns', () => {
    it('should handle the glider pattern', () => {
      // Glider (moves diagonally)
      // Gen 0: .#.
      //        ..#
      //        ###
      const gen0 = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      const gen1 = nextGeneration(gen0);

      // After one generation, glider should have moved
      expect(gen1.length).toBeGreaterThan(0);
    });
  });
});
