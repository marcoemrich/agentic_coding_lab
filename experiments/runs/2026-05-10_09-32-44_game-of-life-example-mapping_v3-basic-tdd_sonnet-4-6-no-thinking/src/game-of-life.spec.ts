import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

describe('Game of Life', () => {
  describe('Rule 1 - Underpopulation', () => {
    it('live cell with 0 neighbors dies', () => {
      const gen0: Cell[] = [[0, 0]];
      expect(nextGeneration(gen0)).toEqual([]);
    });

    it('live cell with 1 neighbor dies', () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expect(nextGeneration(gen0)).toEqual([]);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('live cell with 2 neighbors survives', () => {
      // Block: (0,0),(1,0),(0,1),(1,1) - each has 3 neighbors
      // Use a line: (0,0),(1,0),(2,0) - middle has 2 neighbors
      const gen0: Cell[] = [[0, 0], [1, 0], [2, 0]];
      const gen1 = nextGeneration(gen0);
      // (1,0) has 2 neighbors: (0,0) and (2,0) → survives
      expect(gen1).toContainEqual([1, 0]);
    });

    it('live cell with 3 neighbors survives', () => {
      // (1,1) has 3 neighbors: (0,1),(1,2),(2,1)
      const gen0: Cell[] = [[0, 1], [1, 2], [2, 1], [1, 1]];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toContainEqual([1, 1]);
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('live cell with 4 neighbors dies', () => {
      // Center (1,1) surrounded by 4 live cells
      const gen0: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
      const gen1 = nextGeneration(gen0);
      expect(gen1).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('dead cell with exactly 3 live neighbors becomes alive', () => {
      // (1,1) is dead, neighbors: (0,0),(1,0),(0,1) → 3 neighbors
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toContainEqual([1, 1]);
    });
  });

  describe('Pattern examples', () => {
    it('single cell dies', () => {
      const gen0: Cell[] = [[0, 0]];
      expect(nextGeneration(gen0)).toEqual([]);
    });

    it('block (still life) remains unchanged', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toHaveLength(4);
      expect(gen1).toContainEqual([0, 0]);
      expect(gen1).toContainEqual([1, 0]);
      expect(gen1).toContainEqual([0, 1]);
      expect(gen1).toContainEqual([1, 1]);
    });

    it('blinker oscillates', () => {
      // Gen 0: vertical blinker at x=0, y=0,1,2
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      // Gen 1: horizontal blinker at y=1, x=-1,0,1
      expect(gen1).toHaveLength(3);
      expect(gen1).toContainEqual([-1, 1]);
      expect(gen1).toContainEqual([0, 1]);
      expect(gen1).toContainEqual([1, 1]);

      // Gen 2 should return to gen 0
      const gen2 = nextGeneration(gen1);
      expect(gen2).toHaveLength(3);
      expect(gen2).toContainEqual([0, 0]);
      expect(gen2).toContainEqual([0, 1]);
      expect(gen2).toContainEqual([0, 2]);
    });

    it('handles negative coordinates', () => {
      const gen0: Cell[] = [[-1, -1], [0, -1], [-1, 0]];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toContainEqual([0, 0]);
    });

    it('empty grid stays empty', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });
});
