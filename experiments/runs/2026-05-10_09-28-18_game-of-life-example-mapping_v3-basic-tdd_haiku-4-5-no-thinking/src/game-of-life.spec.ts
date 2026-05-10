import { describe, it, expect } from 'vitest';
import { GameOfLife } from './game-of-life';

describe('Game of Life', () => {
  describe('Rule 1 - Underpopulation', () => {
    it('should kill live cells with fewer than 2 neighbors', () => {
      const grid = new GameOfLife([[0, 1], [1, 1]]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([]);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('should keep live cells with 2 or 3 neighbors alive', () => {
      const grid = new GameOfLife([[0, 0], [0, 1], [0, 2], [1, 1]]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toContainEqual([0, 1]);
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('should kill live cells with more than 3 neighbors', () => {
      const grid = new GameOfLife([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]);
      const nextGen = grid.nextGeneration();
      const liveCells = nextGen.getLiveCells();
      expect(liveCells).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('should create live cells from dead cells with exactly 3 neighbors', () => {
      const grid = new GameOfLife([[0, 0], [0, 1], [1, 0]]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toContainEqual([1, 1]);
    });
  });

  describe('Blinker Pattern', () => {
    it('should oscillate between two states', () => {
      const grid0 = new GameOfLife([[0, 0], [0, 1], [0, 2]]);
      const grid1 = grid0.nextGeneration();
      const grid2 = grid1.nextGeneration();

      expect(grid1.getLiveCells()).toEqual([[-1, 1], [0, 1], [1, 1]]);
      expect(grid2.getLiveCells()).toEqual([[0, 0], [0, 1], [0, 2]]);
    });
  });

  describe('Block Pattern', () => {
    it('should remain unchanged as a still life', () => {
      const grid = new GameOfLife([[0, 0], [1, 0], [0, 1], [1, 1]]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
    });
  });

  describe('Single Cell Dies', () => {
    it('should die when isolated', () => {
      const grid = new GameOfLife([[0, 0]]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([]);
    });
  });

  describe('Negative Coordinates', () => {
    it('should handle negative coordinates correctly', () => {
      const grid = new GameOfLife([[-1, -1], [-1, 0], [0, -1]]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toContainEqual([0, 0]);
    });
  });

  describe('Empty Grid', () => {
    it('should remain empty', () => {
      const grid = new GameOfLife([]);
      const nextGen = grid.nextGeneration();
      expect(nextGen.getLiveCells()).toEqual([]);
    });
  });
});
