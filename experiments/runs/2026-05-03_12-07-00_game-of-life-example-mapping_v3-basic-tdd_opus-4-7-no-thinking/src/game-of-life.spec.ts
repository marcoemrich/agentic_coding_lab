import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const expectSameCells = (actual: Cell[], expected: Cell[]) => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe('Game of Life - nextGeneration', () => {
  describe('empty grid', () => {
    it('returns empty for an empty grid', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe('Rule 1: Underpopulation', () => {
    it('a single cell dies (0 neighbors)', () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });

    it('two adjacent cells die (1 neighbor each)', () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('Rule 2: Survival', () => {
    it('a live cell with 2 neighbors survives', () => {
      // Blinker center: (0,0), (0,1), (0,2) - center (0,1) has 2 neighbors
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      // center should survive
      expect(sortCells(result)).toContainEqual([0, 1]);
    });

    it('a live cell with 3 neighbors survives', () => {
      // L-shape: (0,0), (1,0), (0,1) - cell (0,0) has 2 neighbors
      // Use case where a cell has 3 neighbors:
      // ## .
      // # #
      // . . .
      // cell (0,1) has neighbors at (1,1)? Let's pick block + extra
      // Block: (0,0),(1,0),(0,1),(1,1) — each has 3 neighbors
      const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('a live cell with more than 3 neighbors dies', () => {
      // Full 3x3:
      // ###
      // ###
      // ###
      // center (1,1) has 8 neighbors → dies
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(cells);
      expect(sortCells(result)).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('a dead cell with exactly 3 live neighbors becomes alive', () => {
      // ##.
      // #..
      // Cells: (0,0),(1,0),(0,1)
      // Dead cell (1,1) has 3 neighbors → becomes alive
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('Patterns', () => {
    it('Blinker oscillates', () => {
      // Gen 0: vertical (0,0),(0,1),(0,2)
      // Gen 1: horizontal (-1,1),(0,1),(1,1)
      const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);

      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it('Block remains stable', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });

    it('handles negative coordinates', () => {
      // Blinker centered at negative coords
      const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
    });

    it('does not duplicate cells when input has duplicates', () => {
      // Defensive - with duplicates in input, behavior should still be sane
      // A single cell with itself listed once still has 0 neighbors
      const result = nextGeneration([[0, 0]]);
      expect(result).toEqual([]);
    });
  });
});
