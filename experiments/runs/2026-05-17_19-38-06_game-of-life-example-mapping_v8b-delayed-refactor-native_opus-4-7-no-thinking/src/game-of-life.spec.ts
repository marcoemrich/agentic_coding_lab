import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe('nextGeneration', () => {
  describe('empty input', () => {
    it('returns empty array for empty input', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe('Rule 1 - Underpopulation', () => {
    it('a single cell dies', () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });

    it('two adjacent cells both die (each has 1 neighbor)', () => {
      const result = nextGeneration([[0, 1], [1, 1]]);
      expect(result).toEqual([]);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('a live cell with 2 neighbors survives', () => {
      // L-shape: (0,0), (1,0), (0,1) - (0,0) has 2 neighbors
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      // (0,0) survives (2 neighbors), (1,0) survives (1 neighbor → dies),
      // Actually let's verify: (0,0) neighbors are (1,0) and (0,1) → 2 neighbors → survives
      // (1,0) neighbors are (0,0) and (0,1) → 2 neighbors → survives
      // (0,1) neighbors are (0,0) and (1,0) → 2 neighbors → survives
      // dead cell (1,1) has 3 neighbors: (0,0), (1,0), (0,1) → becomes alive
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });

    it('a live cell with 3 neighbors survives (center of T-shape)', () => {
      // ###
      // .#.
      // (0,1), (1,1), (2,1), (1,0)
      // Center (1,1) has 3 neighbors → survives
      const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 0]]);
      expect(sortCells(result)).toContainEqual([1, 1]);
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('center cell of full 3x3 dies due to overpopulation', () => {
      // All 9 cells alive
      const cells: Cell[] = [];
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          cells.push([x, y]);
        }
      }
      const result = nextGeneration(cells);
      // Center (1,1) has 8 neighbors → dies
      expect(sortCells(result)).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('dead cell with exactly 3 neighbors becomes alive', () => {
      // ##.
      // #..
      // ...
      // (0,2), (1,2), (0,1)
      // Dead cell (1,1) has 3 neighbors → comes alive
      const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
      expect(sortCells(result)).toContainEqual([1, 1]);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker becomes horizontal', () => {
      // Vertical: (0,0), (0,1), (0,2)
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expectSameCells(result, [[-1, 1], [0, 1], [1, 1]]);
    });

    it('horizontal blinker becomes vertical (period 2)', () => {
      const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('block remains unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expectSameCells(result, block);
    });

    it('block stays a block after multiple generations', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      let current = block;
      for (let i = 0; i < 5; i++) {
        current = nextGeneration(current);
      }
      expectSameCells(current, block);
    });
  });

  describe('Infinite grid - negative coordinates', () => {
    it('handles negative coordinates', () => {
      // Block at negative coords
      const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
      const result = nextGeneration(block);
      expectSameCells(result, block);
    });

    it('blinker spanning origin', () => {
      // Horizontal blinker at (-1, 0), (0, 0), (1, 0)
      const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
      expectSameCells(result, [[0, -1], [0, 0], [0, 1]]);
    });
  });

  describe('Sparse representation', () => {
    it('does not return dead cells in the output', () => {
      const result = nextGeneration([[0, 0]]);
      expect(result).toEqual([]);
    });

    it('returns cells far from origin without including empty space', () => {
      const result = nextGeneration([[1000, 1000], [1001, 1000], [1000, 1001], [1001, 1001]]);
      expect(result.length).toBe(4);
    });
  });

  describe('Input independence', () => {
    it('does not mutate the input array', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const snapshot = JSON.parse(JSON.stringify(input));
      nextGeneration(input);
      expect(input).toEqual(snapshot);
    });
  });
});
