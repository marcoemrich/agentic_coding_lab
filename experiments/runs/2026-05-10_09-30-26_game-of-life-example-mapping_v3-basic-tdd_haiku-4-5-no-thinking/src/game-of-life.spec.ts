import { describe, it, expect } from 'vitest';
import { GameOfLife } from './game-of-life';

describe('Game of Life', () => {
  describe('Rule 1: Underpopulation', () => {
    it('should kill a live cell with fewer than 2 neighbors', () => {
      const gol = new GameOfLife([[0, 1], [1, 1]]);
      const nextGen = gol.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([]);
    });
  });

  describe('Rule 2: Survival', () => {
    it('should keep a live cell with 2 neighbors alive', () => {
      // Block pattern - each cell has exactly 3 neighbors and should survive
      const gol = new GameOfLife([[0, 0], [1, 0], [0, 1], [1, 1]]);
      const nextGen = gol.nextGeneration();
      const cells = nextGen.getLiveCells().sort();
      expect(cells).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
    });

    it('should keep a live cell with 3 neighbors alive', () => {
      // Center cell (1,1) has 3 neighbors in plus pattern
      const gol = new GameOfLife([[0, 1], [1, 0], [1, 1], [1, 2]]);
      const nextGen = gol.nextGeneration();
      const cells = nextGen.getLiveCells();
      expect(cells).toContainEqual([1, 1]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('should kill a live cell with more than 3 neighbors', () => {
      // Center cell (1,1) has 4 neighbors
      const gol = new GameOfLife([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
      const nextGen = gol.nextGeneration();
      const cells = nextGen.getLiveCells();
      expect(cells).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('should create a live cell from a dead cell with exactly 3 neighbors', () => {
      // Dead cell (1,1) has exactly 3 neighbors
      const gol = new GameOfLife([[0, 0], [1, 0], [0, 1]]);
      const nextGen = gol.nextGeneration();
      const cells = nextGen.getLiveCells();
      expect(cells).toContainEqual([1, 1]);
    });
  });

  describe('Pattern: Blinker', () => {
    it('should oscillate between vertical and horizontal', () => {
      // Vertical blinker
      const gol = new GameOfLife([[0, 0], [0, 1], [0, 2]]);
      const gen1 = gol.nextGeneration();
      const gen1Cells = gen1.getLiveCells().sort();
      expect(gen1Cells).toEqual([[-1, 1], [0, 1], [1, 1]]);

      // Next generation should return to vertical
      const gen2 = gen1.nextGeneration();
      const gen2Cells = gen2.getLiveCells().sort();
      expect(gen2Cells).toEqual([[0, 0], [0, 1], [0, 2]]);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('should remain unchanged', () => {
      const gol = new GameOfLife([[0, 0], [1, 0], [0, 1], [1, 1]]);
      const nextGen = gol.nextGeneration();
      const nextCells = nextGen.getLiveCells().sort();
      expect(nextCells).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
    });
  });

  describe('Pattern: Single cell', () => {
    it('should die with no neighbors', () => {
      const gol = new GameOfLife([[0, 0]]);
      const nextGen = gol.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([]);
    });
  });

  describe('Empty grid', () => {
    it('should remain empty', () => {
      const gol = new GameOfLife([]);
      const nextGen = gol.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([]);
    });
  });

  describe('Negative coordinates', () => {
    it('should support negative coordinates', () => {
      // Horizontal line at y=-1, becomes vertical line at x=0
      const gol = new GameOfLife([[-1, -1], [0, -1], [1, -1]]);
      const nextGen = gol.nextGeneration();
      const cells = nextGen.getLiveCells();
      // Sort by x then y for consistent comparison
      const sorted = cells.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
      expect(sorted).toEqual([[0, -2], [0, -1], [0, 0]]);
    });
  });
});
