import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

describe('Game of Life', () => {
  describe('nextGeneration', () => {
    it('returns an empty set when there are no living cells', () => {
      const result = nextGeneration([]);
      expect(result).toEqual([]);
    });

    it('kills a lone living cell (underpopulation)', () => {
      const cells: Cell[] = [[0, 0]];
      const result = nextGeneration(cells);
      expect(result).toEqual([]);
    });

    it('kills two adjacent living cells (underpopulation)', () => {
      const cells: Cell[] = [[0, 0], [1, 0]];
      const result = sortCells(nextGeneration(cells));
      expect(result).toEqual([]);
    });

    it('keeps a living cell with two living neighbors alive', () => {
      // A blinker (vertical) becomes horizontal in next generation.
      // Vertical: (0,0), (0,1), (0,2). Middle has 2 neighbors and survives.
      const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = sortCells(nextGeneration(cells));
      expect(result).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
    });

    it('kills a living cell with more than three living neighbors (overpopulation)', () => {
      // Center cell (0,0) with 4 neighbors
      const cells: Cell[] = [
        [0, 0],
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ];
      const result = nextGeneration(cells);
      // Center cell dies due to overpopulation
      expect(result).not.toContainEqual([0, 0]);
    });

    it('brings a dead cell to life with exactly three living neighbors', () => {
      // L-shape: (0,0), (1,0), (0,1) - dead cell at (1,1) has 3 neighbors
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = sortCells(nextGeneration(cells));
      // Block stable pattern: all 4 corners alive
      expect(result).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
    });

    it('preserves a stable block pattern', () => {
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = sortCells(nextGeneration(cells));
      expect(result).toEqual(sortCells(cells));
    });

    it('handles negative coordinates correctly', () => {
      // Block at negative coordinates - should remain stable
      const cells: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
      const result = sortCells(nextGeneration(cells));
      expect(result).toEqual(sortCells(cells));
    });

    it('blinker oscillates between vertical and horizontal', () => {
      const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const horizontal = sortCells(nextGeneration(vertical));
      expect(horizontal).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
      const backToVertical = sortCells(nextGeneration(horizontal));
      expect(backToVertical).toEqual(sortCells(vertical));
    });

    it('does not contain duplicates in the next generation', () => {
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(cells);
      const stringified = result.map(c => `${c[0]},${c[1]}`);
      const unique = new Set(stringified);
      expect(unique.size).toBe(result.length);
    });

    it('handles a glider correctly', () => {
      // Glider pattern
      const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      const next = sortCells(nextGeneration(glider));
      const expected = sortCells([[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]]);
      expect(next).toEqual(expected);
    });
  });
});

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
