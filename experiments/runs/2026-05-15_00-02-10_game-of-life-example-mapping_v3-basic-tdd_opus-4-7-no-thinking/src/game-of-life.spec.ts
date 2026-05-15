import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

// Helper to normalize cell arrays for order-independent comparison
function normalize(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation', () => {
    it('a single live cell dies', () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });

    it('two adjacent cells both die (each has 1 neighbor)', () => {
      expect(normalize(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
    });
  });

  describe('Rule 2: Survival', () => {
    it('a cell with 2 neighbors survives', () => {
      // Blinker horizontal middle cell will have 2 neighbors
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expect(result).toContainEqual([0, 1]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('a cell with 4 neighbors dies', () => {
      // Center of a plus-shape pattern: center has 4 neighbors
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(cells);
      // Center cell (1,1) had 4 neighbors -> dies
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('a dead cell with exactly 3 neighbors becomes alive', () => {
      // L-shape: (0,0), (1,0), (0,1) -> (1,1) has 3 neighbors
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      expect(result).toContainEqual([1, 1]);
    });
  });

  describe('Patterns', () => {
    it('Blinker oscillates: vertical -> horizontal', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expect(normalize(gen1)).toEqual(normalize([[-1, 1], [0, 1], [1, 1]]));
    });

    it('Blinker oscillates: horizontal -> vertical (back to original)', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2 = nextGeneration(gen1);
      expect(normalize(gen2)).toEqual(normalize([[0, 0], [0, 1], [0, 2]]));
    });

    it('Block is a still life', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expect(normalize(nextGeneration(block))).toEqual(normalize(block));
    });

    it('Empty grid stays empty', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe('Infinite grid / negative coordinates', () => {
    it('handles negative coordinates', () => {
      const cells: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const result = nextGeneration(cells);
      expect(normalize(result)).toEqual(normalize([[-6, -4], [-5, -4], [-4, -4]]));
    });

    it('blinker at large coordinates', () => {
      const cells: Cell[] = [[1000, 1000], [1000, 1001], [1000, 1002]];
      const result = nextGeneration(cells);
      expect(normalize(result)).toEqual(normalize([[999, 1001], [1000, 1001], [1001, 1001]]));
    });
  });

  describe('Rule 4 example from prompt', () => {
    it('produces expected output for L-shape', () => {
      // Gen 0:  ##.
      //         #..
      //         ...
      // Cells: (0,0)=top-left, (1,0)=top-mid, (0,1)=mid-left
      // Expected Gen 1:
      //         ##.
      //         ##.
      //         ...
      // Cells: (0,0), (1,0), (0,1), (1,1)
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const gen1 = nextGeneration(gen0);
      expect(normalize(gen1)).toEqual(normalize([[0, 0], [1, 0], [0, 1], [1, 1]]));
    });
  });
});
