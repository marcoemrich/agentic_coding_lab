import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]) =>
  expect(sorted(actual)).toEqual(sorted(expected));

describe('nextGeneration', () => {
  it('returns no cells for an empty grid', () => {
    expectCells(nextGeneration([]), []);
  });

  describe('rule 1 - underpopulation', () => {
    it('kills a lone cell with no neighbors', () => {
      expectCells(nextGeneration([[0, 0]]), []);
    });

    it('kills two adjacent cells that each have only one neighbor', () => {
      expectCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('rule 2 - survival', () => {
    it('keeps a cell with two live neighbors alive', () => {
      // The blinker's centre cell has exactly 2 neighbors and lives on.
      expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toContainEqual([0, 1]);
    });

    it('keeps a cell with three live neighbors alive', () => {
      // In the block every cell has exactly 3 neighbors, so all four survive.
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCells(nextGeneration(block), block);
    });
  });

  describe('rule 3 - overpopulation', () => {
    it('kills a cell with more than three live neighbors', () => {
      // ###
      // .#.   -> the centre (1,1) has 4 live neighbors and dies.
      // ###
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      expect(sorted(nextGeneration(gen0))).not.toContainEqual([1, 1]);
    });

    it('kills the centre of a plus while sparing its arms', () => {
      // .#.
      // ###   -> centre (1,1) has 4 neighbors and dies; each arm has 3 and survives.
      // .#.
      const plus: Cell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
      expectCells(nextGeneration(plus), [
        [0, 0], [2, 0],
        [1, 0], [0, 1], [2, 1], [1, 2],
        [0, 2], [2, 2],
      ]);
    });
  });

  describe('rule 4 - reproduction', () => {
    it('brings a dead cell with exactly three live neighbors to life', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      expectCells(nextGeneration(gen0), [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('patterns', () => {
    it('oscillates a vertical blinker into a horizontal one', () => {
      expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [
        [-1, 1], [0, 1], [1, 1],
      ]);
    });

    it('returns the blinker to its original orientation after two generations', () => {
      const gen2 = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
      expectCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it('leaves a block unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCells(nextGeneration(block), block);
    });
  });

  describe('infinite grid', () => {
    it('handles negative coordinates', () => {
      const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
      expectCells(nextGeneration(block), block);
    });

    it('handles very large coordinates', () => {
      const blinker: Cell[] = [
        [1_000_000, 0],
        [1_000_000, 1],
        [1_000_000, 2],
      ];
      expectCells(nextGeneration(blinker), [
        [999_999, 1], [1_000_000, 1], [1_000_001, 1],
      ]);
    });
  });

  describe('input handling', () => {
    it('does not modify the input array', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      nextGeneration(gen0);
      expect(gen0).toEqual([[0, 0], [0, 1], [0, 2]]);
    });

    it('returns each living cell exactly once even when the input has duplicates', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 0]];
      expectCells(nextGeneration(block), [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });
});
