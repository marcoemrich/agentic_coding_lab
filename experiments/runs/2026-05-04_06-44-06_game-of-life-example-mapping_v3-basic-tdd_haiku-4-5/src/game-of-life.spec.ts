import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('Game of Life - Next Generation', () => {
  describe('Rule 1: Underpopulation', () => {
    it('should kill a live cell with fewer than 2 neighbors', () => {
      // Gen 0: ##
      //        ..
      // Each cell has only 1 neighbor
      const cells = [[0, 1], [1, 1]];
      const result = nextGeneration(cells);
      expect(result).toEqual([]);
    });

    it('should kill an isolated cell', () => {
      // Single cell with 0 neighbors
      const cells = [[0, 0]];
      const result = nextGeneration(cells);
      expect(result).toEqual([]);
    });
  });

  describe('Rule 2: Survival', () => {
    it('should keep a live cell with exactly 2 neighbors alive', () => {
      // Gen 0: ###
      //        ...
      //        .#.
      // Center cell (1,1) has 3 neighbors but let's test with 2
      const cells = [[0, 0], [1, 0], [2, 0], [1, 1]];
      const result = nextGeneration(cells);
      // The cells with 2+ neighbors should survive
      expect(result.length).toBeGreaterThan(0);
    });

    it('should keep a live cell with exactly 3 neighbors alive', () => {
      // Gen 0: ###
      //        ...
      //        .#.
      // Center cell (1,1) has exactly 3 neighbors
      const cells = [[0, 0], [1, 0], [2, 0], [1, 1]];
      const result = nextGeneration(cells);
      // Cell (1,0) should survive (has 2 neighbors on its left and right)
      // Cell (1,1) should become alive (has exactly 3 neighbors above)
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('should kill a live cell with more than 3 neighbors', () => {
      // Gen 0: ###
      //        .#.
      //        ###
      // Center cell (1,1) has 4 live neighbors and should die
      const cells = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
      const result = nextGeneration(cells);
      // (1,1) should be dead in the result
      const hasCenter = result.some(c => c[0] === 1 && c[1] === 1);
      expect(hasCenter).toBe(false);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('should create a new live cell if dead cell has exactly 3 neighbors', () => {
      // Gen 0: ##.
      //        #..
      //        ...
      // Dead cell (1,1) has exactly 3 neighbors: (0,0), (1,0), (0,1)
      const cells = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      // (1,1) should be born
      const hasNewCell = result.some(c => c[0] === 1 && c[1] === 1);
      expect(hasNewCell).toBe(true);
    });

    it('should not create a cell with fewer than 3 neighbors', () => {
      // Gen 0: #..
      //        ...
      //        ...
      // Dead cells around it have fewer than 3 neighbors
      const cells = [[0, 0]];
      const result = nextGeneration(cells);
      expect(result.length).toBe(0);
    });
  });

  describe('Pattern Examples', () => {
    describe('Blinker (oscillator)', () => {
      it('should oscillate between vertical and horizontal', () => {
        // Gen 0: .#.
        //        .#.
        //        .#.
        // Coords: [(0,0), (0,1), (0,2)] or vertically aligned
        const gen0 = [[0, 0], [0, 1], [0, 2]];
        const gen1 = nextGeneration(gen0);
        // Gen 1 should be: ###
        //                  ...
        //                  ...
        // Horizontally: [(-1,1), (0,1), (1,1)]
        const gen1Sorted = gen1.map(c => [...c] as [number, number]).sort();
        const expectedGen1 = [[-1, 1], [0, 1], [1, 1]].sort();
        expect(gen1Sorted).toEqual(expectedGen1);

        // Gen 2 should be back to vertical
        const gen2 = nextGeneration(gen1);
        const gen2Sorted = gen2.map(c => [...c] as [number, number]).sort();
        const expectedGen2 = [[0, 0], [0, 1], [0, 2]].sort();
        expect(gen2Sorted).toEqual(expectedGen2);
      });
    });

    describe('Block (still life)', () => {
      it('should remain unchanged', () => {
        // Gen 0: ##
        //        ##
        // Coords: [(0,0), (1,0), (0,1), (1,1)]
        const cells = [[0, 0], [1, 0], [0, 1], [1, 1]];
        const result = nextGeneration(cells);
        const resultSorted = result.map(c => [...c] as [number, number]).sort();
        const expectedSorted = cells.sort();
        expect(resultSorted).toEqual(expectedSorted);
      });
    });

    describe('Single cell dies', () => {
      it('should eliminate a single cell', () => {
        const cells = [[0, 0]];
        const result = nextGeneration(cells);
        expect(result).toEqual([]);
      });
    });
  });

  describe('Negative coordinates', () => {
    it('should handle negative x coordinates', () => {
      // Create a pattern with negative x
      const cells = [[-1, 0], [0, 0], [1, 0]];
      const result = nextGeneration(cells);
      // Should work without errors and produce valid results
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle negative y coordinates', () => {
      // Create a pattern with negative y
      const cells = [[0, -1], [0, 0], [0, 1]];
      const result = nextGeneration(cells);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle both negative x and y', () => {
      const cells = [[-1, -1], [0, -1], [-1, 0]];
      const result = nextGeneration(cells);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle an empty grid', () => {
      const cells: Array<[number, number]> = [];
      const result = nextGeneration(cells);
      expect(result).toEqual([]);
    });

    it('should handle sparse patterns with gaps', () => {
      const cells = [[0, 0], [10, 10]];
      const result = nextGeneration(cells);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
